import ClassStudent from '@/components/pages/admindemo/ClassStudent';
import CompoundSoundLesson from '@/components/pages/admindemo/CompoundSoundLesson';
import PhoneticLesson from '@/components/pages/admindemo/PhoneticLesson';
import VocabularyLesson from '@/components/pages/admindemo/VocabularyLesson';
import { mockData } from '@/utils/mock-data';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/')({
    component: Index,
});

type TabKey = 'vowel' | 'consonant' | 'compound' | 'vocab' | 'class';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'vowel', label: 'Âm tiết' },
    { key: 'compound', label: 'Âm ghép' },
    { key: 'vocab', label: 'Từ vựng' },
    { key: 'class', label: 'Bài học' },
];

export default function Index() {
    const [activeTab, setActiveTab] = useState<TabKey>('vowel');

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-56 bg-white border-r shadow-sm">
                <div>
                    <div className="p-4 text-lg font-bold border-b">Admin</div>
                    <button className="rounded bg-amber-400 p-2 cursor-pointer" onClick={mockData}>
                        Mock data
                    </button>
                </div>

                <nav className="p-2 space-y-1">
                    {TABS.map((tab) => {
                        const active = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    w-full text-left px-3 py-2 rounded-md transition
                                    ${
                                        active
                                            ? 'bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-500'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-6 overflow-auto">
                {activeTab === 'vowel' && <PhoneticLesson />}
                {activeTab === 'compound' && <CompoundSoundLesson />}
                {activeTab === 'vocab' && <VocabularyLesson />}
                {activeTab === 'class' && <ClassStudent />}
            </main>
        </div>
    );
}
