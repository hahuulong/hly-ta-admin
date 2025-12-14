import { saveLS } from './storage-demo';

export function mockData() {
    // === Vowels ===
    const vowels = [
        {
            type: 'vowel',
            rootSound: 'a',
            note: 'Ngắn',
            variants: [
                { text: 'a', image: '', audio: '' },
                { text: 'ā', image: '', audio: '' },
            ],
        },
        {
            type: 'vowel',
            rootSound: 'e',
            note: 'Ngắn',
            variants: [
                { text: 'e', image: '', audio: '' },
                { text: 'ē', image: '', audio: '' },
            ],
        },
        {
            type: 'vowel',
            rootSound: 'i',
            note: 'Ngắn',
            variants: [
                { text: 'i', image: '', audio: '' },
                { text: 'ī', image: '', audio: '' },
            ],
        },
        {
            type: 'vowel',
            rootSound: 'o',
            note: 'Ngắn',
            variants: [
                { text: 'o', image: '', audio: '' },
                { text: 'ō', image: '', audio: '' },
            ],
        },
        {
            type: 'vowel',
            rootSound: 'u',
            note: 'Ngắn',
            variants: [
                { text: 'u', image: '', audio: '' },
                { text: 'ū', image: '', audio: '' },
            ],
        },
    ];

    // === Consonants ===
    const consonants = [
        {
            type: 'consonant',
            rootSound: 'b',
            note: 'Âm bật',
            variants: [
                { text: 'b', image: '', audio: '' },
                { text: 'bʰ', image: '', audio: '' },
            ],
        },
        {
            type: 'consonant',
            rootSound: 'c',
            note: 'Âm bật',
            variants: [
                { text: 'c', image: '', audio: '' },
                { text: 'ch', image: '', audio: '' },
            ],
        },
        {
            type: 'consonant',
            rootSound: 'd',
            note: 'Âm bật',
            variants: [
                { text: 'd', image: '', audio: '' },
                { text: 'dh', image: '', audio: '' },
            ],
        },
        {
            type: 'consonant',
            rootSound: 'f',
            note: 'Âm bật',
            variants: [
                { text: 'f', image: '', audio: '' },
                { text: 'ph', image: '', audio: '' },
            ],
        },
        {
            type: 'consonant',
            rootSound: 'g',
            note: 'Âm bật',
            variants: [
                { text: 'g', image: '', audio: '' },
                { text: 'gh', image: '', audio: '' },
            ],
        },
    ];

    // === Compound Sounds ===
    const compoundSounds = [
        {
            rootSound: 'ab',
            note: 'Âm ghép',
            variants: [{ text: 'ab', image: '', audio: '' }],
            examples: [
                { wordEn: 'cab', meaningVi: 'xe taxi' },
                { wordEn: 'lab', meaningVi: 'phòng thí nghiệm' },
            ],
        },
        {
            rootSound: 'ac',
            note: 'Âm ghép',
            variants: [{ text: 'ac', image: '', audio: '' }],
            examples: [
                { wordEn: 'mac', meaningVi: 'quần áo' },
                { wordEn: 'pac', meaningVi: 'bưu kiện' },
            ],
        },
        {
            rootSound: 'ad',
            note: 'Âm ghép',
            variants: [{ text: 'ad', image: '', audio: '' }],
            examples: [
                { wordEn: 'bad', meaningVi: 'tệ' },
                { wordEn: 'cad', meaningVi: 'kẻ xấu' },
            ],
        },
        {
            rootSound: 'ae',
            note: 'Âm ghép',
            variants: [{ text: 'ae', image: '', audio: '' }],
            examples: [
                { wordEn: 'dae', meaningVi: 'gia đình' },
                { wordEn: 'mae', meaningVi: 'mẹ' },
            ],
        },
        {
            rootSound: 'af',
            note: 'Âm ghép',
            variants: [{ text: 'af', image: '', audio: '' }],
            examples: [
                { wordEn: 'faf', meaningVi: 'người mẹ' },
                { wordEn: 'laf', meaningVi: 'cây lau' },
            ],
        },
    ];

    // === Vocabularies ===
    const vocabularies = [
        { type: 'short', word: 'hi', meaning: 'chào' },
        { type: 'short', word: 'dog', meaning: 'con chó' },
        { type: 'long', word: 'elephant', meaning: 'con voi' },
        { type: 'long', word: 'giraffe', meaning: 'con hươu cao cổ' },
        { type: 'short', word: 'cat', meaning: 'con mèo' },
        { type: 'short', word: 'bird', meaning: 'con chim' },
        { type: 'long', word: 'alligator', meaning: 'cá sấu' },
        { type: 'long', word: 'kangaroo', meaning: 'chuột túi' },
        { type: 'short', word: 'sun', meaning: 'mặt trời' },
        { type: 'short', word: 'moon', meaning: 'mặt trăng' },
    ];

    // === Classes ===
    const classes = [
        {
            name: '1A',
            items: [
                { source: 'vowel', index: 0 },
                { source: 'vowel', index: 1 },
                { source: 'compound', index: 0 },
                { source: 'compound', index: 1 },
                { source: 'vocab', index: 0 },
                { source: 'vocab', index: 1 },
            ],
        },
        {
            name: '1B',
            items: [
                { source: 'vowel', index: 2 },
                { source: 'vowel', index: 3 },
                { source: 'compound', index: 2 },
                { source: 'compound', index: 3 },
                { source: 'vocab', index: 2 },
                { source: 'vocab', index: 3 },
            ],
        },
        {
            name: '2A',
            items: [
                { source: 'vowel', index: 4 },
                { source: 'vowel', index: 0 },
                { source: 'compound', index: 4 },
                { source: 'compound', index: 0 },
                { source: 'vocab', index: 4 },
                { source: 'vocab', index: 5 },
            ],
        },
        {
            name: '2B',
            items: [
                { source: 'vowel', index: 1 },
                { source: 'vowel', index: 2 },
                { source: 'compound', index: 1 },
                { source: 'compound', index: 2 },
                { source: 'vocab', index: 6 },
                { source: 'vocab', index: 7 },
            ],
        },
        {
            name: '3A',
            items: [
                { source: 'vowel', index: 3 },
                { source: 'vowel', index: 4 },
                { source: 'compound', index: 3 },
                { source: 'compound', index: 4 },
                { source: 'vocab', index: 8 },
                { source: 'vocab', index: 9 },
            ],
        },
    ];

    // === Save to localStorage ===
    saveLS('vowels', vowels);
    saveLS('consonants', consonants);
    saveLS('compoundSounds', compoundSounds);
    saveLS('vocabularies', vocabularies);
    saveLS('classes', classes);

    console.log('✅ Mock data đã tạo xong, mỗi lớp có 2 từ mỗi loại!');
}
