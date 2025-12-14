import { useEffect, useState } from 'react';
import { loadLS, saveLS } from '../../../utils/storage-demo';

// ================= Types =================
export type VocabularyType = 'short' | 'long';

export interface VocabularyItem {
    type: VocabularyType;
    word: string;
    meaning: string;
}

interface VocabularyLessonProps {
    type?: VocabularyType;
}

// ================= UI helpers =================
interface TextInputProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
}

const TextInput = ({ id, label, value, onChange }: TextInputProps) => (
    <div className="space-y-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={id}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const Modal = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            {children}
        </div>
    </div>
);

// ================= Speech =================
const speak = (text: string) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
};

// ================= Main =================
export default function VocabularyLesson({ type = 'short' }: VocabularyLessonProps) {
    const storageKey = 'vocabularies';

    // VIEW (ngoài)
    const [viewType, setViewType] = useState<VocabularyType>(type);

    // FORM (trong modal)
    const [formType, setFormType] = useState<VocabularyType>('short');
    const [word, setWord] = useState('');
    const [meaning, setMeaning] = useState('');
    const [_audioFile, setAudioFile] = useState<File | null>(null);

    const [list, setList] = useState<VocabularyItem[]>([]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const [showFormModal, setShowFormModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

    useEffect(() => {
        setList((loadLS(storageKey) as VocabularyItem[]) || []);
    }, []);

    // ================= Validation =================
    const isFormValid = () => word.trim() !== '' && meaning.trim() !== '';

    // ================= CRUD =================
    const openCreate = () => {
        resetForm();
        setFormType(viewType);
        setShowFormModal(true);
    };

    const openEdit = (realIndex: number) => {
        const item = list[realIndex];
        setEditingIndex(realIndex);
        setFormType(item.type);
        setWord(item.word);
        setMeaning(item.meaning);
        setShowFormModal(true);
    };

    const save = () => {
        if (!isFormValid()) return;

        const newItem: VocabularyItem = {
            type: formType,
            word: word.trim(),
            meaning: meaning.trim(),
        };

        const newList = [...list];
        if (editingIndex !== null) newList[editingIndex] = newItem;
        else newList.push(newItem);

        saveLS(storageKey, newList);
        setList(newList);
        resetForm();
        setShowFormModal(false);
    };

    const confirmDelete = () => {
        if (deleteIndex === null) return;
        const newList = list.filter((_, i) => i !== deleteIndex);
        saveLS(storageKey, newList);
        setList(newList);
        setDeleteIndex(null);
    };

    const resetForm = () => {
        setWord('');
        setMeaning('');
        setAudioFile(null);
        setEditingIndex(null);
    };

    // ================= FIX QUAN TRỌNG =================
    // giữ lại index gốc
    const filteredList = list.map((item, index) => ({ item, index })).filter(({ item }) => item.type === viewType);

    // ================= UI =================
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">Từ vựng</h2>
                <div className="flex gap-2">
                    <select
                        id="vocab-view-type"
                        className="rounded-lg border px-3 py-2 text-sm"
                        value={viewType}
                        onChange={(e) => setViewType(e.target.value as VocabularyType)}
                    >
                        <option value="short">Từ ngắn</option>
                        <option value="long">Từ dài</option>
                    </select>
                    <button
                        onClick={openCreate}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                        + Thêm từ
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="rounded-xl bg-white p-6 shadow">
                <div className="space-y-3">
                    {filteredList.map(({ item, index }) => (
                        <div
                            key={index}
                            className="flex items-center justify-between rounded-lg border px-4 py-3 hover:bg-gray-50"
                        >
                            <div>
                                <div className="font-medium">{item.word}</div>
                                <div className="text-xs text-gray-500">{item.meaning}</div>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <button onClick={() => speak(item.word)}>🔊</button>
                                <button onClick={() => openEdit(index)} className="text-blue-600">
                                    Sửa
                                </button>
                                <button onClick={() => setDeleteIndex(index)} className="text-red-600">
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredList.length === 0 && <div className="text-sm text-gray-500 italic">Chưa có từ nào</div>}
                </div>
            </div>

            {/* FORM MODAL */}
            {showFormModal && (
                <Modal>
                    <h3 className="text-lg font-semibold mb-4">
                        {editingIndex !== null ? 'Sửa từ vựng' : 'Thêm từ vựng'}
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="vocab-form-type" className="text-sm font-medium">
                                Loại từ (dữ liệu)
                            </label>
                            <select
                                id="vocab-form-type"
                                className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                                value={formType}
                                onChange={(e) => setFormType(e.target.value as VocabularyType)}
                            >
                                <option value="short">Từ ngắn</option>
                                <option value="long">Từ dài</option>
                            </select>
                        </div>

                        <TextInput id="vocab-word" label="Từ tiếng Anh" value={word} onChange={setWord} />
                        <TextInput id="vocab-meaning" label="Nghĩa tiếng Việt" value={meaning} onChange={setMeaning} />

                        <div>
                            <label htmlFor="vocab-audio" className="text-sm font-medium">
                                Âm thanh (không lưu)
                            </label>
                            <input
                                id="vocab-audio"
                                type="file"
                                accept="audio/*"
                                onChange={(e) => setAudioFile(e.target.files?.[0] ?? null)}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => speak(word)}
                            className="rounded-lg border px-3 py-2 text-sm"
                        >
                            🔊 Nghe phát âm
                        </button>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setShowFormModal(false)} className="rounded-lg border px-4 py-2">
                            Hủy
                        </button>
                        <button
                            disabled={!isFormValid()}
                            onClick={save}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {editingIndex !== null ? 'Cập nhật' : 'Lưu'}
                        </button>
                    </div>
                </Modal>
            )}

            {/* DELETE MODAL */}
            {deleteIndex !== null && (
                <Modal>
                    <h3 className="text-lg font-semibold mb-3">Xác nhận xóa</h3>
                    <p className="text-sm text-gray-600 mb-6">Bạn có chắc chắn muốn xóa từ này không?</p>
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
