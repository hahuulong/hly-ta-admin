import { useEffect, useMemo, useState } from 'react';
import { loadLS, saveLS } from '../../../utils/storage-demo';

// ================= Types =================
type SourceType = 'vowel' | 'compound' | 'vocab';

interface LessonItemRef {
    source: SourceType;
    index: number;
}

interface ClassLesson {
    name: string;
    items: LessonItemRef[];
}

interface SelectableItem {
    rootSound?: string;
    word?: string;
}

// ================= Modal =================
const Modal = ({ children }: { children: React.ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            {children}
        </div>
    </div>
);

// ================= Main =================
export default function ClassStudent() {
    const storageKey = 'classes';

    const [classes, setClasses] = useState<ClassLesson[]>([]);
    const [activeClass, setActiveClass] = useState<number | null>(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showAddItemModal, setShowAddItemModal] = useState(false);

    const [className, setClassName] = useState('');

    // ===== ADD ITEM MODAL STATE =====
    const [activeTab, setActiveTab] = useState<SourceType>('vowel');

    const [searchMap, setSearchMap] = useState<Record<SourceType, string>>({
        vowel: '',
        compound: '',
        vocab: '',
    });

    const [selectedMap, setSelectedMap] = useState<Record<SourceType, Set<number>>>({
        vowel: new Set(),
        compound: new Set(),
        vocab: new Set(),
    });

    const sourceKeyMap: Record<SourceType, string> = {
        vowel: 'vowels',
        compound: 'compoundSounds',
        vocab: 'vocabularies',
    };

    // ================= Load data =================
    useEffect(() => {
        setClasses((loadLS(storageKey) as ClassLesson[]) || []);
    }, []);

    const sourceDataMap = {
        vowel: useMemo<SelectableItem[]>(() => (loadLS(sourceKeyMap.vowel) as SelectableItem[]) || [], []),
        compound: useMemo<SelectableItem[]>(() => (loadLS(sourceKeyMap.compound) as SelectableItem[]) || [], []),
        vocab: useMemo<SelectableItem[]>(() => (loadLS(sourceKeyMap.vocab) as SelectableItem[]) || [], []),
    };

    const filteredData = sourceDataMap[activeTab]
        .map((item, index) => ({ item, index }))
        .filter(({ item }) =>
            (item.rootSound || item.word || '').toLowerCase().includes(searchMap[activeTab].toLowerCase()),
        );

    // ================= CRUD =================
    const createClass = () => {
        if (!className.trim()) return;
        const newList = [...classes, { name: className.trim(), items: [] }];
        setClasses(newList);
        saveLS(storageKey, newList);
        setClassName('');
        setShowCreateModal(false);
    };

    const addItemsToClass = () => {
        if (activeClass === null) return;

        const newItems: LessonItemRef[] = [];
        (Object.keys(selectedMap) as SourceType[]).forEach((source) => {
            selectedMap[source].forEach((index) => {
                newItems.push({ source, index });
            });
        });

        const newClasses = [...classes];
        newClasses[activeClass].items.push(...newItems);

        setClasses(newClasses);
        saveLS(storageKey, newClasses);

        // reset modal state
        setSelectedMap({ vowel: new Set(), compound: new Set(), vocab: new Set() });
        setSearchMap({ vowel: '', compound: '', vocab: '' });
        setShowAddItemModal(false);
    };

    // ================= UI =================
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Bài học</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                    + Thêm bài
                </button>
            </div>

            {/* CLASS LIST */}
            <div className="grid gap-4 sm:grid-cols-2">
                {classes.map((cls, i) => (
                    <div
                        key={i}
                        className={`rounded-xl border p-4 ${activeClass === i ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold">{cls.name}</div>
                                <div className="text-xs text-gray-500">{cls.items.length} mục</div>
                            </div>
                            <button
                                onClick={() => {
                                    setActiveClass(i);
                                    setShowAddItemModal(true);
                                }}
                                className="text-blue-600 text-sm"
                            >
                                + Thêm nội dung
                            </button>
                        </div>

                        {/* Render items info */}
                        {cls.items.length > 0 && (
                            <div className="mt-3 space-y-1 max-h-48 overflow-y-auto">
                                {cls.items.map((it, idx) => {
                                    const data = sourceDataMap[it.source][it.index];
                                    const label = data?.rootSound || data?.word || '[Không xác định]';
                                    const typeLabel =
                                        it.source === 'vowel'
                                            ? 'Âm tiết'
                                            : it.source === 'compound'
                                              ? 'Âm ghép'
                                              : 'Từ vựng';
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                                        >
                                            <div>
                                                <span className="font-medium">{label}</span>{' '}
                                                <span className="text-gray-500">({typeLabel})</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ))}
                {classes.length === 0 && <div className="text-sm text-gray-500">Chưa có bài nào</div>}
            </div>

            {/* CREATE CLASS MODAL */}
            {showCreateModal && (
                <Modal>
                    <h3 className="text-lg font-semibold mb-4">Tạo bài học</h3>
                    <input
                        className="w-full rounded-lg border px-3 py-2"
                        placeholder="Tên bài"
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setShowCreateModal(false)} className="rounded-lg border px-4 py-2">
                            Hủy
                        </button>
                        <button onClick={createClass} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
                            Tạo
                        </button>
                    </div>
                </Modal>
            )}

            {/* ADD ITEM MODAL */}
            {showAddItemModal && (
                <Modal>
                    <h3 className="text-lg font-semibold mb-4">Thêm nội dung vào bài</h3>

                    {/* Tabs */}
                    <div className="flex gap-2 border-b mb-4">
                        {(['vowel', 'compound', 'vocab'] as SourceType[]).map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={`px-4 py-2 text-sm border-b-2 ${
                                    activeTab === t
                                        ? 'border-blue-500 text-blue-600 font-semibold'
                                        : 'border-transparent text-gray-600'
                                }`}
                            >
                                {t === 'vowel' && 'Âm tiết'}
                                {t === 'compound' && 'Âm ghép'}
                                {t === 'vocab' && 'Từ vựng'}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <input
                        className="mb-3 w-full rounded-lg border px-3 py-2"
                        placeholder="Tìm kiếm..."
                        value={searchMap[activeTab]}
                        onChange={(e) => setSearchMap({ ...searchMap, [activeTab]: e.target.value })}
                    />

                    {/* List */}
                    <div className="max-h-72 overflow-y-auto space-y-2">
                        {filteredData.map(({ item, index }) => {
                            const label = item.rootSound || item.word || '';
                            const checked = selectedMap[activeTab].has(index);

                            return (
                                <label
                                    key={index}
                                    className="flex items-center gap-3 rounded-lg border px-3 py-2 hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => {
                                            const newSet = new Set(selectedMap[activeTab]);
                                            if (checked) {
                                                newSet.delete(index);
                                            } else {
                                                newSet.add(index);
                                            }
                                            setSelectedMap({ ...selectedMap, [activeTab]: newSet });
                                        }}
                                    />
                                    <span>{label}</span>
                                </label>
                            );
                        })}
                        {filteredData.length === 0 && <div className="text-sm text-gray-500">Không có dữ liệu</div>}
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button onClick={() => setShowAddItemModal(false)} className="rounded-lg border px-4 py-2">
                            Hủy
                        </button>
                        <button onClick={addItemsToClass} className="rounded-lg bg-blue-600 px-4 py-2 text-white">
                            OK
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
