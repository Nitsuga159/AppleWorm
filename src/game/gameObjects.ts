import Square from "../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import Skewers from "./Skewers";
import Stone from "./Stone";
import WormPiece from "./WormPiece";

const GAME_OBJETS: { [key: string]: typeof Square } = {
    "apple": Apple,
    "block": Block,
    "worm": WormPiece,
    "stone": Stone,
    "skewers": Skewers
}

export default GAME_OBJETS