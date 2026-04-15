function PromoCards() {
  const cards = [1, 2, 3, 4];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {cards.map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl shadow p-3 flex items-center justify-center h-40"
        >
          <p className="text-gray-500">Card {i + 1}</p>
        </div>
      ))}

    </div>
  );
}

export default PromoCards;