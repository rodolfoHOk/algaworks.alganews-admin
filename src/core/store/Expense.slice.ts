import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Key } from 'antd/lib/table/interface';
import moment from 'moment';
import { CashFlow, CashFlowService } from 'rodolfohiok-sdk';
import { RootState } from '../store';
import getThunkStatus from '../utils/getThunkStatus';

interface ExpenseState {
  list: CashFlow.EntrySummary[];
  fetching: boolean;
  query: CashFlow.Query;
  selected: Key[];
}

const initialState: ExpenseState = {
  list: [],
  fetching: false,
  query: {
    type: 'EXPENSE',
    sort: ['transactedOn', 'desc'],
    yearMonth: moment().format('YYYY-MM'),
  },
  selected: [],
};

export const getExpenses = createAsyncThunk(
  'cash-flow/expenses/getExpenses',
  async (_, { getState, dispatch }) => {
    const { query } = (getState() as RootState).expense;
    const expenses = await CashFlowService.getAllEntries(query);
    await dispatch(storeList(expenses));
  }
);

export const deleteEntriesInBatch = createAsyncThunk(
  'cash-flow/expenses/deleteEntriesInBatch',
  async (ids: number[], { dispatch }) => {
    await CashFlowService.removeEntriesBatch(ids);
    await dispatch(getExpenses());
  }
);

const expenseSlice = createSlice({
  initialState,
  name: 'cash-flow/expenses',
  reducers: {
    storeList(state, action: PayloadAction<CashFlow.EntrySummary[]>) {
      state.list = action.payload;
    },
    setQuery(state, action: PayloadAction<Partial<CashFlow.Query>>) {
      state.query = {
        ...state.query,
        ...action.payload,
      };
    },
    setSelectedExpenses(state, action: PayloadAction<Key[]>) {
      state.selected = action.payload;
    },
    setFetching(state, action: PayloadAction<boolean>) {
      state.fetching = action.payload;
    },
  },
  extraReducers(builder) {
    const { success, error, loading } = getThunkStatus([
      getExpenses,
      deleteEntriesInBatch,
    ]);
    builder
      .addMatcher(success, (state) => {
        state.fetching = false;
      })
      .addMatcher(error, (state) => {
        state.fetching = false;
      })
      .addMatcher(loading, (state) => {
        state.fetching = true;
      });
  },
});

export const { storeList, setQuery, setSelectedExpenses, setFetching } =
  expenseSlice.actions;

const ExpenseReducer = expenseSlice.reducer;
export default ExpenseReducer;