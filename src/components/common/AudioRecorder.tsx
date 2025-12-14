import { useRef, useState } from 'react';

export default function AudioRecorder() {
    const [recording, setRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            const url = URL.createObjectURL(blob);
            setAudioUrl(url);
        };

        mediaRecorder.start();
        setRecording(true);
    };

    const stopRecording = () => {
        mediaRecorderRef.current?.stop();
        setRecording(false);
    };

    const deleteRecording = () => {
        setAudioUrl(null);
        chunksRef.current = [];
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md space-y-4">
            <button
                onClick={recording ? stopRecording : startRecording}
                className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                    recording ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
            >
                {recording ? 'Đang thu âm... Nhấn để dừng' : 'Bắt đầu thu âm'}
            </button>

            {audioUrl && (
                <div className="flex flex-col items-center space-y-2">
                    <audio controls src={audioUrl} className="w-full rounded-lg border border-gray-300 shadow-sm">
                        <track kind="captions" />
                    </audio>
                    <button
                        onClick={deleteRecording}
                        className="px-4 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm text-gray-700"
                    >
                        Xóa bản ghi
                    </button>
                </div>
            )}
        </div>
    );
}
