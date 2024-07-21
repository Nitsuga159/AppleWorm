import Square from "../motor/Shape/Square";
import Apple from "./objects/Apple";
import Block from "./objects/Block";
import Hole from "./objects/Hole";
import Skewers from "./objects/Skewers";
import Stone from "./objects/Stone";
import WormPiece from "./objects/WormPiece";
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