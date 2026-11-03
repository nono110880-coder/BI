function parseCurrencyNumber(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  let str = String(val).trim();
  if (!str || str === '-' || str === '–' || str === '—') return 0;

  let isNegative = false;
  if (/^\(.*\)$/.test(str)) {
    isNegative = true;
    str = str.slice(1, -1).trim();
  } else if (str.startsWith('-')) {
    isNegative = true;
    str = str.slice(1).trim();
  }

  str = str.replace(/^(rp\.?|idr|\$)\s*/i, '').replace(/\s+/g, '').replace(/\u00a0/g, '').trim();
  if (!/\d/.test(str)) return 0;

  const lastDot = str.lastIndexOf('.');
  const lastComma = str.lastIndexOf(',');

  if (lastDot > -1 && lastComma > -1) {
    if (lastDot > lastComma) {
      str = str.replace(/,/g, '');
    } else {
      str = str.replace(/\./g, '').replace(',', '.');
    }
  } else if (lastComma > -1 && lastDot === -1) {
    const parts = str.split(',');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      str = str.replace(/,/g, '');
    } else {
      str = str.replace(',', '.');
    }
  } else if (lastDot > -1 && lastComma === -1) {
    const parts = str.split('.');
    if (parts.length > 2 || (parts.length === 2 && parts[1].length === 3)) {
      str = str.replace(/\./g, '');
    }
  }

  const cleanNum = str.replace(/[^0-9.-]/g, '');
  const num = parseFloat(cleanNum);
  if (isNaN(num)) return 0;
  return isNegative ? -num : num;
}

function detectDhaColumns(headers) {
  let dhaIdx = -1;
  let coaIdx = -1;
  let anggaranIdx = -1;
  let naturalIdx = -1;

  const cleans = headers.map(h => String(h || '').trim().toLowerCase().replace(/[^a-z0-9]/g, ''));

  coaIdx = cleans.findIndex(c => 
    !c.includes('bank') && (
      c === 'rangkaiancoa' || c === 'kodecoa' || c === 'coa' || 
      c.includes('rangkaian') || (c.includes('rekening') && !c.includes('nama'))
    )
  );

  const strongAnggaranAliases = [
    'anggaranrp', 'anggaran', 'pagu', 'paguanggaran', 'pagurp', 'paguawal',
    'nominal', 'nominalrp', 'nominalanggaran', 'totalanggaran', 'nilaianggaran',
    'saldo', 'saldorp', 'saldoawal', 'saldotersedia', 'alokasi', 'alokasidana',
    'alokasianggaran', 'plafon', 'plafond', 'jumlahanggaran', 'jumlahnominal',
    'nilaipagu', 'biaya', 'biayarp'
  ];

  anggaranIdx = cleans.findIndex((c, i) => {
    if (i === coaIdx) return false;
    const isDescription = c.includes('dha') || c.includes('uraian') || c.includes('kegiatan') || 
                          c.includes('himpunan') || c.includes('deskripsi') || c.includes('nama') ||
                          c.includes('subkegiatan') || c.includes('program');
    if (isDescription) return false;
    if (c.includes('bank') || c.includes('coa') || c.includes('rangkaian') || (c.includes('akun') && !c.includes('nominal'))) return false;
    return strongAnggaranAliases.includes(c);
  });

  if (anggaranIdx === -1) {
    anggaranIdx = cleans.findIndex((c, i) => {
      if (i === coaIdx) return false;
      const isDescription = c.includes('dha') || c.includes('uraian') || c.includes('kegiatan') || 
                            c.includes('himpunan') || c.includes('deskripsi') || c.includes('nama') ||
                            c.includes('subkegiatan') || c.includes('program');
      if (isDescription) return false;
      if (c.includes('bank') || c.includes('coa') || c.includes('rangkaian') || (c.includes('akun') && !c.includes('nominal'))) return false;
      return c.includes('anggaran') || c.includes('pagu') || c.includes('nominal') || c.includes('saldo') || c.includes('plafon') || c.includes('alokasi');
    });
  }

  naturalIdx = cleans.findIndex((c, i) => {
    if (i === coaIdx || i === anggaranIdx) return false;
    return c === 'naturalakun' || c === 'kategoriakun' || c === 'namaakun' || 
           c === 'natural' || c.includes('kategori') || 
           (c.includes('akun') && !c.includes('coa') && !c.includes('rekening') && !c.includes('bank'));
  });

  dhaIdx = cleans.findIndex((c, i) => {
    if (i === coaIdx || i === anggaranIdx || i === naturalIdx) return false;
    return c.includes('dha') || c.includes('uraian') || c.includes('kegiatan') || 
           c.includes('himpunan') || c === 'nama' || c.includes('deskripsi') || c.includes('program');
  });

  return { dhaIdx, coaIdx, anggaranIdx, naturalIdx };
}

const sampleData = [
  {
    'No': 1,
    'DHA (Uraian Kegiatan / Anggaran)': 'Pelaksanaan pengawasan KUPVA BB dalam rangka implementasi dan optimaliasi kebijakan pengawasan SP',
    'Rangkaian COA': '1-731001-713001-35-4100-063-011-040-8000-001-00000',
    'Anggaran (Rp)': 'Rp 1.119.622.455',
    'Natural Akun': 'Administrasi Bank - Rupiah'
  },
  {
    'No': 2,
    'DHA (Uraian Kegiatan / Anggaran)': 'TEST DATA BARU DHA 12345',
    'Rangkaian COA': '1-999999-999999-99-9999-999-999-999-9999-999-99999',
    'Anggaran (Rp)': 50000000,
    'Natural Akun': 'Beban Rapat'
  }
];

const keys = Object.keys(sampleData[0]);
const colMap = detectDhaColumns(keys);
console.log('Detected Column Map:', colMap);

for (const row of sampleData) {
  const rawDha = colMap.dhaIdx !== -1 ? row[keys[colMap.dhaIdx]] : '';
  const rawCoa = colMap.coaIdx !== -1 ? row[keys[colMap.coaIdx]] : '';
  const rawAnggaran = colMap.anggaranIdx !== -1 ? row[keys[colMap.anggaranIdx]] : 0;
  const rawNatural = colMap.naturalIdx !== -1 ? row[keys[colMap.naturalIdx]] : '';

  console.log('Result for row:', {
    dha: rawDha,
    coa: rawCoa,
    anggaran: parseCurrencyNumber(rawAnggaran),
    natural: rawNatural
  });
}
