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

const initialState: Userdata = {
  value: [],
  status: 'idle',
  jsonData: data, // Initialize with data directly
  selectedTemplatedata: {},
  selectedItem: undefined,

}

// Async thunk for API call
export const fetchData = createAsyncThunk('userdata/fetchData', async () => {
  const response = await axios.get(API_BASE_URL) // Replace with your API URL
  return response.data
})

export const Userdataslice = createSlice({
  name: 'userdata',
  initialState,
  reducers: {
    updateTemplateData: (state, action: PayloadAction<any>) => {
      state.selectedTemplatedata = action.payload;
      console.log("Selected Template Data:", state.selectedTemplatedata);
    },
    setSelectedItem: (state, action: PayloadAction<any | undefined>) => {
      state.selectedItem = action.payload;
      if (action.payload) {
        console.log("Selected Item:", action.payload);
      }
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
      })
      .addCase(fetchData.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default Userdataslice.reducer

export const { updateTemplateData, setSelectedItem } = Userdataslice.actions