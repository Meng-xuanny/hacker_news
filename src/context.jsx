import React, { useContext, useEffect, useReducer } from "react";
import useCaseReducers from "use-case-reducers";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?";

const initialState = {
  isLoading: true,
  hits: [],
  query: "react",
  page: 0,
  nbPages: 0,
};

const caseReducers = {
  setLoading: (state) => {
    state.isLoading = true;
  },
  setStories: (state, data) => {
    (state.isLoading = false),
      (state.nbPages = data.nbPages),
      (state.hits = data.hits);
  },
  removeStory: (state, id) => {
    let newStories = state.hits.filter((hit) => hit.objectID !== id);
    state.hits = newStories;
  },
  handleSearch: (state, input) => {
    (state.query = input), (state.page = 0);
  },
  handlePageInc: (state) => {
    let nextPage = state.page + 1;
    if (nextPage > state.nbPages - 1) nextPage = 0;
    state.page = nextPage;
  },
  handlePageDec: (state) => {
    let prevPage = state.page - 1;
    if (prevPage < 0) prevPage = state.nbPages - 1;
    state.page = prevPage;
  },
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [
    state,
    dispatch,
    {
      setLoading,
      setStories,
      removeStory,
      handleSearch,
      handlePageDec,
      handlePageInc,
    },
  ] = useCaseReducers(caseReducers, initialState);

  const fetchStories = async (url) => {
    dispatch(setLoading());
    try {
      const res = await fetch(url);
      const data = await res.json();
      dispatch(setStories(data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStories(`${API_ENDPOINT}query=${state.query}&page=${state.page}`);
  }, [state.query, state.page]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        removeStory,
        dispatch,
        handleSearch,
        handlePageDec,
        handlePageInc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
