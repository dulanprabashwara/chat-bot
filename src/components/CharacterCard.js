import Link from "next/link";

export default function CharacterCard({ character }) {
  return (
    <Link href={`/chat/${character.id}`}>
      <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg hover:border-green-400 hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="text-center">
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
            {character.avatar}
          </div>

          <h3 className="text-xl font-bold text-green-400 mb-2">
            {character.name}
          </h3>

          <p className="text-gray-400 mb-4">{character.role}</p>

          <p className="text-sm text-gray-300 leading-relaxed">
            {character.personality}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-700">
            <span className="text-green-400 text-sm font-medium">
              Start Chat →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
