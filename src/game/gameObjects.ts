import Square from "../motor/Shape/Square";
import Apple from "./Apple";
import Block from "./Block";
import Hole from "./Hole";
import Skewers from "./Skewers";
import Stone from "./Stone";
import WormPiece from "./WormPiece";
import { Class } from "./interfaces/Class";

const GAME_OBJETS: { [key: string]: Class<Square> } = {
    "apple": Apple,
    "block": Block,
    "worm": WormPiece,
    "stone": Stone,
    "skewers": Skewers,
    "hole": Hole
}

export default GAME_OBJETS