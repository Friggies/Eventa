import { createContext, useContext } from "react";

export const MyContext = createContext(null);

function useMyContext() {
    return useContext(MyContext);
}

export default useMyContext;
