import { useEffect, useState } from 'react';
import { loadLS, saveLS } from '../../../utils/storage-demo';

import demoImage from '@/assets/images/img-demo.webp';

// ================= Types =================
export type PhoneticType = 'vowel' | 'consonant';

export interface VariantForm {
    text: string;
    imageFile: File | null;
    imagePreview: string;
    audioFile: File | null;
    audioPreview: string;
}

export interface StoredVariant {
    text: string;
    image: string;
    audio: string;
}

export interface PhoneticLessonItem {
    type: PhoneticType;
    rootSound: string;
    note: string;
    variants: StoredVariant[];
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            {children}
        </div>
    </div>
);

// ================= Main =================
export default function PhoneticLesson() {
    // 🔹 FILTER BÊN NGOÀI
    const [viewType, setViewType] = useState<PhoneticType>('vowel');

    // 🔹 FORM STATE
    const [phoneticType, setPhoneticType] = useState<PhoneticType>('vowel');
    const [rootSound, setRootSound] = useState('');
    const [note, setNote] = useState('');
    const [variants, setVariants] = useState<VariantForm[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [list, setList] = useState<PhoneticLessonItem[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    const storageKey = viewType === 'vowel' ? 'vowels' : 'consonants';

    // ================= Effects =================
    useEffect(() => {
        setList(loadLS(storageKey) as PhoneticLessonItem[]);
    }, [storageKey]);

    // ================= Speech =================
    const speak = (text: string) => {
        if (!text) return;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'vi-VN';
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
    };

    // ================= Helpers =================
    const addVariant = () => {
        setVariants((prev) => [
            ...prev,
            { text: '', imageFile: null, imagePreview: '', audioFile: null, audioPreview: '' },
        ]);
    };

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

    const isVariantValid = (v: VariantForm) => v.text.trim() !== '';
    const isFormValid = () => rootSound.trim() !== '' && variants.some(isVariantValid);

    const resetForm = () => {
        setRootSound('');
        setNote('');
        setVariants([]);
        setEditingIndex(null);
    };

    // ================= CRUD =================
    const openCreate = () => {
        resetForm();
        setPhoneticType(viewType);
        setShowModal(true);
    };

    const openEdit = (index: number) => {
        const item = list[index];
        setEditingIndex(index);
        setPhoneticType(item.type);
        setRootSound(item.rootSound);
        setNote(item.note);
        setVariants(
            item.variants.map((v) => ({
                text: v.text,
                imageFile: null,
                imagePreview: '',
                audioFile: null,
                audioPreview: '',
            })),
        );
        setShowModal(true);
    };

    const save = () => {
        if (!isFormValid()) return;

        const newItem: PhoneticLessonItem = {
            type: phoneticType,
            rootSound: rootSound.trim(),
            note: note.trim(),
            variants: variants.filter(isVariantValid).map((v) => ({ text: v.text.trim(), image: '', audio: '' })),
        };

        const key = phoneticType === 'vowel' ? 'vowels' : 'consonants';
        const oldList = (loadLS(key) as PhoneticLessonItem[]) || [];
        const newList = [...oldList];

        if (editingIndex !== null) newList[editingIndex] = newItem;
        else newList.push(newItem);

        saveLS(key, newList);
        setShowModal(false);
        resetForm();
        setList(loadLS(storageKey) as PhoneticLessonItem[]);
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
            {/* FILTER */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setViewType('vowel')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        viewType === 'vowel' ? 'bg-blue-600 text-white' : 'border bg-white hover:bg-gray-50'
                    }`}
                >
                    Nguyên âm
                </button>
                <button
                    onClick={() => setViewType('consonant')}
                    className={`rounded-lg px-4 py-2 text-sm font-medium ${
                        viewType === 'consonant' ? 'bg-blue-600 text-white' : 'border bg-white hover:bg-gray-50'
                    }`}
                >
                    Phụ âm
                </button>

                <div className="flex-1" />

                <button
                    onClick={openCreate}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                    + Thêm bài âm
                </button>
            </div>

            {/* LIST */}
            <div className="rounded-xl bg-white shadow divide-y">
                {list.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4">
                        <img
                            src={demoImage}
                            alt={`Hình minh họa cho âm ${item.rootSound}`}
                            className="h-12 w-12 rounded-lg border object-cover"
                        />

                        <div className="flex-1">
                            <div className="font-semibold">{item.rootSound}</div>
                            <div className="text-xs text-gray-500">{item.variants?.length} biến thể</div>
                        </div>

                        <button
                            onClick={() => speak(item.rootSound)}
                            className="rounded-full border p-2 hover:bg-gray-100"
                            aria-label="Phát âm âm gốc"
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
                        {editingIndex !== null ? 'Sửa bài âm' : 'Thêm bài âm'}
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="nguyen-phu-lua-chon" className="text-sm font-medium">
                                Loại âm
                            </label>
                            <select
                                id="nguyen-phu-lua-chon"
                                value={phoneticType}
                                onChange={(e) => setPhoneticType(e.target.value as PhoneticType)}
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                            >
                                <option value="vowel">Nguyên âm</option>
                                <option value="consonant">Phụ âm</option>
                            </select>
                        </div>

                        <TextInput id="root-sound" label="Âm gốc" value={rootSound} onChange={setRootSound} />
                    </div>

                    <div className="mt-4">
                        <TextInput id="note" label="Ghi chú" value={note} onChange={setNote} />
                    </div>

                    {/* VARIANTS */}
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between">
                            <span className="font-medium">Cách đọc (nặng, nhẹ) của âm</span>
                            <button onClick={addVariant} className="text-sm text-blue-600">
                                + Thêm
                            </button>
                        </div>

                        {variants.map((v, i) => (
                            <div key={i} className="rounded-lg border p-3 space-y-3">
                                <TextInput
                                    id={`variant-text-${i}`}
                                    label="Cách đọc"
                                    value={v.text}
                                    onChange={(val) => updateVariant(i, 'text', val)}
                                />

                                <div className="flex items-center gap-4">
                                    <img
                                        src={v.imagePreview || demoImage}
                                        alt={v.text ? `Hình minh họa cho ${v.text}` : 'Hình minh họa mặc định'}
                                        className="h-16 w-16 rounded-lg border object-cover"
                                    />

                                    <button
                                        onClick={() => speak(v.text || rootSound)}
                                        className="rounded-full border p-3 hover:bg-gray-100"
                                        aria-label="Phát âm biến thể"
                                    >
                                        🔊
                                    </button>
                                </div>

                                <div className="flex gap-3">
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
                                </div>

                                <button onClick={() => removeVariant(i)} className="text-xs text-red-600">
                                    Xóa biến thể
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
