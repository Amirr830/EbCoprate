import { hex2Binary } from "../helper/hex2Binary";
import Storages from "../app/storages"

export const CheckAccess = (sectionId) => {

    if (sectionId == -1) return true
    var accessLevel = Storages.getAccessLevel();
    var defualtHeader = process.env.REACT_APP_ACCESS;
    accessLevel = hex2Binary(accessLevel);
    defualtHeader = hex2Binary(defualtHeader);
    if (accessLevel.charAt(sectionId) == 1 && defualtHeader.charAt(sectionId) == 1) {
        return true
    }
    return false
}
