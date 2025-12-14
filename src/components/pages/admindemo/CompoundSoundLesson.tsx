import demoImage from '@/assets/images/img-demo.webp';
import { useEffect, useState } from 'react';
import { loadLS, saveLS } from '../../../utils/storage-demo';

// ================= Types =================
export interface VariantForm {
    text: string;
    imageFile: File | null;
    imagePreview: string;
}

export interface ExampleForm {
    wordEn: string;
    meaningVi: string;
}

export interface StoredVariant {
    text: string;
    image: string;
}

export interface StoredExample {
    wordEn: string;
    meaningVi: string;
}

export interface CompoundSoundItem {
    rootSound: string;
    note: string;
    variants: StoredVariant[];
    examples: StoredExample[];
}

// ================= UI helpers =================
interface TextInputProps {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
}

const TextInput = ({ label, id, value, onChange }: TextInputProps) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
    </div>
);

const Modal = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            {children}
        </div>
    </div>
);

// ================= Main =================
export default function CompoundSoundLesson() {
    const storageKey = 'compoundSounds';

    const [rootSound, setRootSound] = useState('');
    const [note, setNote] = useState('');
    const [variants, setVariants] = useState<VariantForm[]>([]);
    const [examples, setExamples] = useState<ExampleForm[]>([]);

    const [list, setList] = useState<CompoundSoundItem[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    useEffect(() => {
        setList(loadLS(storageKey) as CompoundSoundItem[]);
    }, []);

    // ================= Helpers =================
    const speak = (text: string) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    const resetForm = () => {
        setRootSound('');
        setNote('');
        setVariants([]);
        setExamples([]);
        setEditingIndex(null);
    };

    // ================= Variant =================
    const addVariant = () => setVariants((prev) => [...prev, { text: '', imageFile: null, imagePreview: '' }]);

    const updateVariant = <K extends keyof VariantForm>(index: number, key: K, value: VariantForm[K]) => {
        setVariants((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [key]: value };
            return copy;
        });
    };

    const removeVariant = (index: number) => {
        setVariants((prev) => prev.filter((_, i) => i !== index));
    };

    // ================= Example =================
    const addExample = () => setExamples((prev) => [...prev, { wordEn: '', meaningVi: '' }]);

    const updateExample = <K extends keyof ExampleForm>(index: number, key: K, value: ExampleForm[K]) => {
        setExamples((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], [key]: value };
            return copy;
        });
    };

    const removeExample = (index: number) => {
        setExamples((prev) => prev.filter((_, i) => i !== index));
    };

    // ================= Validation =================
    const isVariantValid = (v: VariantForm) => v.text.trim() !== '';
    const isExampleValid = (e: ExampleForm) => e.wordEn.trim() !== '' && e.meaningVi.trim() !== '';

    const isFormValid = () => rootSound.trim() !== '' && variants.some(isVariantValid) && examples.some(isExampleValid);

    // ================= CRUD =================
    const openCreate = () => {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (index: number) => {
        const item = list[index];
        setEditingIndex(index);
        setRootSound(item.rootSound);
        setNote(item.note);
        setVariants(item.variants.map((v) => ({ text: v.text, imageFile: null, imagePreview: '' })));
        setExamples(item.examples.map((e) => ({ ...e })));
        setShowModal(true);
    };

    const save = () => {
        if (!isFormValid()) return;

        const newItem: CompoundSoundItem = {
            rootSound: rootSound.trim(),
            note: note.trim(),
            variants: variants.filter(isVariantValid).map((v) => ({ text: v.text.trim(), image: '' })),
            examples: examples.filter(isExampleValid).map((e) => ({ ...e })),
        };

        const newList = [...list];
        if (editingIndex !== null) newList[editingIndex] = newItem;
        else newList.push(newItem);

        saveLS(storageKey, newList);
        setList(newList);
        setShowModal(false);
        resetForm();
    };

    const confirmDelete = () => {
        if (deleteIndex === null) return;
        const newList = list.filter((_, i) => i !== deleteIndex);
        saveLS(storageKey, newList);
        setList(newList);
        setDeleteIndex(null);
    };

    // ================= UI =================
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Bài Âm ghép</h2>
                <button
                    onClick={openCreate}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                    + Thêm âm ghép
                </button>
            </div>

            {/* LIST */}
            <div className="rounded-xl bg-white shadow divide-y">
                {list.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                        <img
                            src={demoImage}
                            alt={`Âm ghép ${item.rootSound}`}
                            className="h-12 w-12 rounded-lg border object-cover"
                        />

                        <div className="flex-1">
                            <div className="font-semibold">{item.rootSound}</div>
                            <div className="text-xs text-gray-500">
                                {item.variants?.length} biến thể · {item.examples?.length} ví dụ
                            </div>
                        </div>

                        <button
                            onClick={() => speak(item.rootSound)}
                            className="rounded-full border p-2 hover:bg-gray-100"
                            aria-label="Phát âm"
                        >
                            🔊
                        </button>

                        <button onClick={() => openEdit(i)} className="text-blue-600 text-sm">
                            Sửa
                        </button>
                        <button onClick={() => setDeleteIndex(i)} className="text-red-600 text-sm">
                            Xóa
                        </button>
                    </div>
                ))}
            </div>

            {/* FORM MODAL */}
            {showModal && (
                <Modal>
                    <h3 className="text-lg font-semibold mb-4">
                        {editingIndex !== null ? 'Sửa âm ghép' : 'Thêm âm ghép'}
                    </h3>

                    <TextInput id="compound-root" label="Âm gốc" value={rootSound} onChange={setRootSound} />

                    <div className="mt-4">
                        <TextInput id="compound-note" label="Ghi chú" value={note} onChange={setNote} />
                    </div>

                    {/* Variants */}
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Cách đọc</span>
                            <button onClick={addVariant} className="text-sm text-blue-600">
                                + Thêm
                            </button>
                        </div>

                        {variants.map((v, i) => (
                            <div key={i} className="rounded-lg border p-3 space-y-3">
                                <TextInput
                                    id={`compound-variant-${i}`}
                                    label="Cách đọc"
                                    value={v.text}
                                    onChange={(val) => updateVariant(i, 'text', val)}
                                />

                                <div className="flex items-center gap-4">
                                    <img
                                        src={v.imagePreview || demoImage}
                                        alt={`Biến thể ${v.text || 'mặc định'}`}
                                        className="h-16 w-16 rounded-lg border object-cover"
                                    />
                                    <button
                                        onClick={() => speak(v.text || rootSound)}
                                        className="rounded-full border p-3 hover:bg-gray-100"
                                    >
                                        🔊
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        updateVariant(i, 'imageFile', file);
                                        updateVariant(i, 'imagePreview', URL.createObjectURL(file));
                                    }}
                                />

                                <button onClick={() => removeVariant(i)} className="text-xs text-red-600">
                                    Xóa biến thể
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Examples */}
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Ví dụ</span>
                            <button onClick={addExample} className="text-sm text-blue-600">
                                + Thêm
                            </button>
                        </div>

                        {examples.map((e, i) => (
                            <div key={i} className="rounded-lg border p-3 space-y-3">
                                <TextInput
                                    id={`example-en-${i}`}
                                    label="Từ tiếng Anh"
                                    value={e.wordEn}
                                    onChange={(val) => updateExample(i, 'wordEn', val)}
                                />
                                <TextInput
                                    id={`example-vi-${i}`}
                                    label="Nghĩa tiếng Việt"
                                    value={e.meaningVi}
                                    onChange={(val) => updateExample(i, 'meaningVi', val)}
                                />

                                <button
                                    onClick={() => speak(e.wordEn)}
                                    className="rounded-full border p-3 hover:bg-gray-100"
                                >
                                    🔊 Phát ví dụ
                                </button>

                                <button onClick={() => removeExample(i)} className="text-xs text-red-600">
                                    Xóa ví dụ
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setShowModal(false)} className="rounded-lg border px-4 py-2">
                            Hủy
                        </button>
                        <button
                            disabled={!isFormValid()}
                            onClick={save}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            Lưu
                        </button>
                    </div>
                </Modal>
            )}

            {/* DELETE */}
            {deleteIndex !== null && (
                <Modal>
                    <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setDeleteIndex(null)} className="rounded-lg border px-4 py-2">
                            Hủy
                        </button>
                        <button onClick={confirmDelete} className="rounded-lg bg-red-600 px-4 py-2 text-white">
                            Xóa
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
