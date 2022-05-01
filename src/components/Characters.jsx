import {useState, useEffect, useReducer, useMemo, useRef, useCallback} from 'react';
import Search from './Search';

const initialState = {
    favorites: []
};

const favoriteReducer = (state, action) => {
    switch (action.type){
        case "ADD_TO_FAVORITE":
            return {
                ...state,
                favorites: [ ...state.favorites, action.payload]
            };
        default:
            return state;
    }
}

const Characters = () => {

    const [characters, setCharacters] = useState([]);
    const [favorites, dispatch] = useReducer(favoriteReducer, initialState);
    const [search, setSearch] = useState("");
    const searchInput = useRef(null);

    /* const handleSearch = () => {
        setSearch(searchInput.current.value)
    }; */

    const handleSearch = useCallback (() => {
        setSearch(searchInput.current.value)
    }, [])

    useEffect(() => {
        fetch("https://rickandmortyapi.com/api/character/")
            .then(response => response.json())
            .then(data => setCharacters(data.results))
    }, []);

    const handleClick = (favorite) => {
        dispatch({ type: "ADD_TO_FAVORITE", payload: favorite})
    };

    /* const filterCharacters = characters.filter((char) => {
        return char.name.toLowerCase().includes(search.toLowerCase());
    }); */

    const filterCharacters = useMemo( ()=> 
        characters.filter((char) => {
            return char.name.toLowerCase().includes(search.toLowerCase());
        }), [characters, search]
    )

    return (
        <div className="characters">

            <Search search={search} searchInput={searchInput} handleSearch={handleSearch} />

            {favorites.favorites.map( favorite => (
                <li key={favorite.id}>
                    {favorite.name}
                </li>
            ))}

            {filterCharacters.map(character => (
                <div className="item" key={character.id}>
                    <h2>{character.name}</h2>
                    <button type='button' onClick={() => (handleClick(character))}> Agregar a favoritos </button>
                </div>
            ))}
        </div>
    );
}

export default Characters;