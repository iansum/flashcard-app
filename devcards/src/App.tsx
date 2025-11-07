import { useEffect, useState } from "react";
import { readExcel } from "./utils/readExcel.js";
import type { ExcelRow } from "./utils/readExcel.js";
import  { shuffle } from "lodash-es";

type CardType = {
  id: number,
  Front: string, 
  Back: string,
  isFlipped: boolean;
}

type CardProps = {
  card: CardType;
  handleClick: (card: CardType) => void;
}

// function handleClick(card: CardType){
//     console.log("Card clicked: ", card);
//     card.isFlipped = true;
// }

function Card({card, handleClick} : CardProps) {

  return(
    <>
      <div className="container">
        <div className={"card" + (card.isFlipped ? " flipped" : "")}  onClick={() => handleClick(card)}>
          <div className="card-inner">
            <div className="card-front">
                {card.Front}
            </div>
            <div className="card-back">
                {card.Back}
            </div>  
          </div>
        </div>  
      </div>  
    </>
  )
}
// helper
function generateShuffledCards(data : ExcelRow[]): CardType[]{
    const shuffledData = shuffle(data);

    return shuffledData.map((row, index) => ({
      id: index,
      Front: row.Front,
      Back: row.Back,
      isFlipped: false,
    }));
}


function App() {
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    fetch("/sampleExcelFile.xlsx")
      .then(r => r.arrayBuffer())
      .then(buf => readExcel(buf))
      .then(data => {
        console.log("Parse Excel Data: ", data);
        // data is ExcelRow[] now; convert to CardType[]
        const cardData = generateShuffledCards(data);
        console.log("CardData: ", cardData);
        setCards(cardData);
      })
  }, [])

  function handleCardClick(card: CardType) {
    setCards(prevCards =>
      prevCards.map(c =>
        c.id === card.id
          ? { ...c, isFlipped: !c.isFlipped }
          : c
      )
    );
  }

  const firstCard = cards[0];
  if (!firstCard) {
    return null;
  }

  return(
    <>
      <Card card={firstCard} handleClick={handleCardClick}/>
    </>
  )

}

export default App;