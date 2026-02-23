interface KarmaDisplayProps {
  score: number;
}

export function KarmaDisplay({ score }: KarmaDisplayProps) {
  return (
    <div className="text-center">
      <div className="text-3xl font-extrabold text-gradient">{score}</div>
      <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">Karma</div>
    </div>
  );
}
