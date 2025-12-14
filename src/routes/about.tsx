import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { loadLS } from '../utils/storage-demo';

export const Route = createFileRoute('/about')({
    component: StudentLesson,
});

interface Vowel {
    type: 'vowel';
    rootSound: string;
    note: string;
    variants: { text: string; image: string; audio: string }[];
}

interface CompoundSound {
    rootSound: string;
    note: string;
    variants: { text: string; image: string; audio: string }[];
    examples: { wordEn: string; meaningVi: string }[];
}

interface Vocabulary {
    type: 'short' | 'long';
    word: string;
    meaning: string;
}

type SourceType = 'vowel' | 'compound' | 'vocab';

interface LessonItemRef {
    source: SourceType;
    index: number;
}

interface ClassLesson {
    name: string;
    items: LessonItemRef[];
}

// ================== Speech ==================
const speak = (text: string) => {
    if (!text) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    window.speechSynthesis.speak(utter);
};

// ================== Main Component ==================
function StudentLesson() {
    const [classes, setClasses] = useState<ClassLesson[]>([]);
    const [activeClass, setActiveClass] = useState<number | null>(null);

    const vowels: Vowel[] = (loadLS('vowels') as Vowel[]) || [];

    const compoundSounds: CompoundSound[] = (loadLS('compoundSounds') as CompoundSound[]) || [];
    const vocabularies: Vocabulary[] = (loadLS('vocabularies') as Vocabulary[]) || [];

    useEffect(() => {
        setClasses((loadLS('classes') as ClassLesson[]) || []);
    }, []);

    const renderVariants = (variants: { text: string; image: string; audio: string }[]) => (
        <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
                <div key={i} className="px-2 py-1 rounded bg-gray-100 border text-sm flex items-center gap-1">
                    <span>{v.text}</span>
                    {v.image && <img src={v.image} alt={v.text} className="w-4 h-4 object-contain" />}
                    {(v.audio || v.text) && (
                        <button
                            onClick={() => speak(v.audio || v.text)}
                            className="text-blue-600 hover:underline text-xs"
                        >
                            🔊
                        </button>
                    )}
                </div>
            ))}
        </div>
    );

    const renderItem = (item: LessonItemRef) => {
        switch (item.source) {
            case 'vowel': {
                const data = vowels[item.index];
                if (!data) return null;
                return (
                    <div key={item.index} className="border rounded-lg p-3 shadow-sm bg-white space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">{data.rootSound}</span>
                            <button onClick={() => speak(data.rootSound)} className="text-blue-600 hover:underline">
                                🔊
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">{data.note}</div>
                        {renderVariants(data.variants)}
                    </div>
                );
            }
            case 'compound': {
                const data = compoundSounds[item.index];
                if (!data) return null;
                return (
                    <div key={item.index} className="border rounded-lg p-3 shadow-sm bg-white space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">{data.rootSound}</span>
                            <button onClick={() => speak(data.rootSound)} className="text-blue-600 hover:underline">
                                🔊
                            </button>
                        </div>
                        <div className="text-sm text-gray-500">{data.note}</div>
                        {renderVariants(data.variants)}
                        {data.examples.length > 0 && (
                            <div className="mt-2">
                                <span className="font-medium">Ví dụ:</span>
                                <ul className="list-disc list-inside text-sm text-gray-600">
                                    {data.examples.map((ex, i) => (
                                        <li key={i}>
                                            {ex.wordEn} — {ex.meaningVi}{' '}
                                            <button
                                                onClick={() => speak(ex.wordEn)}
                                                className="text-blue-600 hover:underline text-xs"
                                            >
                                                🔊
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );
            }
            case 'vocab': {
                const data = vocabularies[item.index];
                if (!data) return null;
                return (
                    <div
                        key={item.index}
                        className="border rounded-lg p-3 shadow-sm bg-white flex justify-between items-center"
                    >
                        <div>
                            <div className="font-semibold">{data.word}</div>
                            <div className="text-sm text-gray-500">{data.meaning}</div>
                        </div>
                        <button onClick={() => speak(data.word)} className="text-blue-600 hover:underline">
                            🔊
                        </button>
                    </div>
                );
            }
            default:
                return null;
        }
    };

    const renderClassContent = (cls: ClassLesson) => {
        // Lọc theo loại
        const vowelsItems = cls.items.filter((i) => i.source === 'vowel');
        const compoundsItems = cls.items.filter((i) => i.source === 'compound');
        const vocabItems = cls.items.filter((i) => i.source === 'vocab');

        return (
            <div className="space-y-6">
                {vowelsItems.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Nguyên âm</h3>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {vowelsItems.map(renderItem)}
                        </div>
                    </div>
                )}
                {compoundsItems.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Âm ghép</h3>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {compoundsItems.map(renderItem)}
                        </div>
                    </div>
                )}
                {vocabItems.length > 0 && (
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Từ vựng</h3>
                        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {vocabItems.map(renderItem)}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r shadow-sm p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">Lớp học</h2>
                <div className="space-y-2">
                    {classes.map((cls, i) => (
                        <div
                            key={i}
                            role="button"
                            tabIndex={0}
                            className={`p-3 rounded-lg border cursor-pointer hover:bg-blue-50 transition ${
                                activeClass === i ? 'bg-blue-100 border-blue-500' : 'bg-white'
                            }`}
                            onClick={() => setActiveClass(i)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    setActiveClass(i);
                                }
                            }}
                        >
                            <div className="font-semibold">{cls.name}</div>
                            <div className="text-xs text-gray-500">{cls.items.length} mục</div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {activeClass !== null ? (
                    <>
                        <h2 className="text-2xl font-bold mb-4">Nội dung lớp {classes[activeClass].name}</h2>
                        {renderClassContent(classes[activeClass])}
                    </>
                ) : (
                    <div className="text-gray-500">Chọn một lớp để xem nội dung</div>
                )}
            </main>
        </div>
    );
}
