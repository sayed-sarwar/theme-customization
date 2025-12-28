import { API_BASE_URL } from '@/utils/const'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import data from "../../src/staticjson/data1.json";
import axios from 'axios'

export interface TemplateData {
  label: string;
  id: string;
  url: string;
  active: boolean;
  description: string;
  value: string;
}

export interface Userdata {
  value: any[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed' // Track API call status
  jsonData: {},
  selectedTemplatedata: TemplateData | {},
  selectedItem?: any,
}

// Helper function to load persisted state from localStorage
const loadPersistedState = (): Userdata => {
  try {
    const persisted = localStorage.getItem('userdata_state');
    if (persisted) {
      const parsed = JSON.parse(persisted);
      return {
        value: parsed.value || [],
        status: parsed.status || 'idle',
        jsonData: parsed.jsonData || data,
        selectedTemplatedata: parsed.selectedTemplatedata || {},
        selectedItem: parsed.selectedItem,
      };
    }
  } catch (error) {
    console.warn('Failed to load persisted state:', error);
  }
  return {
    value: [],
    status: 'idle',
    jsonData: data,
    selectedTemplatedata: {},
    selectedItem: undefined,
  };
};

const initialState: Userdata = loadPersistedState()

// Async thunk for API call
export const fetchData = createAsyncThunk('userdata/fetchData', async () => {
  const response = await axios.get(API_BASE_URL) // Replace with your API URL
  return response.data
})

// Helper function to persist state to localStorage
const persistState = (state: Userdata) => {
  try {
    localStorage.setItem('userdata_state', JSON.stringify({
      value: state.value,
      status: state.status,
      jsonData: state.jsonData,
      selectedTemplatedata: state.selectedTemplatedata,
      selectedItem: state.selectedItem,
    }));
  } catch (error) {
    console.warn('Failed to persist state:', error);
  }
};

export const Userdataslice = createSlice({
  name: 'userdata',
  initialState,
  reducers: {
    updateTemplateData: (state, action: PayloadAction<any>) => {
      state.selectedTemplatedata = action.payload;
      console.log("Selected Template Data:", state.selectedTemplatedata);
      persistState(state);
    },
    setSelectedItem: (state, action: PayloadAction<any | undefined>) => {
      state.selectedItem = action.payload;
      if (action.payload) {
        console.log("Selected Item:", action.payload);
      }
      persistState(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchData.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.status = 'succeeded'
        state.value = action.payload
        state.jsonData =  data 
        persistState(state);
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default Userdataslice.reducer

export const { updateTemplateData, setSelectedItem } = Userdataslice.actions