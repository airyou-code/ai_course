import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentBlock {
  type: string;
  content: string;
  uuid?: string;
  post_uuid?: string;
  avatar?: string;
  nextLessonUrl?: string;
}

interface BlocksState {
  blocks: ContentBlock[];
  currentIndex: number;
  currentLessonUUId: string | null; // Добавим поле для хранения lessonUUId
}

const initialState: BlocksState = {
  blocks: [],
  currentIndex: 0,
  currentLessonUUId: null,
};

export const blocksSlice = createSlice({
  name: 'blocks',
  initialState,
  reducers: {
    setBlocks: (state, action: PayloadAction<ContentBlock[]>) => {
      state.blocks = action.payload;
    },
    clearBlocks: (state) => {
      state.blocks = [];
      state.currentIndex = 0;
    },
    showNextBlocks: (state, action: PayloadAction<ContentBlock[]>) => {
      let index = state.currentIndex;
      const externalBlocks = action.payload;
      while (index < externalBlocks.length) {
        const block = externalBlocks[index];
        state.blocks.push(block);
        index++;
        if (block.type === "button_continue" || block.type === "input_gpt") {
          break;
        }
      }
      state.currentIndex = index;
    },
    addBlocks: (state, action: PayloadAction<ContentBlock[]>) => {
      state.blocks = [...state.blocks, ...action.payload];
    },
    removeByTypes: (state, action: PayloadAction<string[]>) => {
      state.blocks = state.blocks.filter(
        (block) => !action.payload.includes(block.type)
      );
    },
    incrementIndex: (state) => {
      state.currentIndex++;
    },
    resetIndex: (state) => {
      state.currentIndex = 0;
    },

    removeBlockAtIndex: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index >= 0 && index < state.blocks.length) {
        state.blocks.splice(index, 1);
      }
    },
    setCurrentLessonUUId: (state, action: PayloadAction<string>) => {
      state.currentLessonUUId = action.payload;
    },
  },
});

export const {
  setBlocks,
  clearBlocks,
  showNextBlocks,
  addBlocks,
  removeByTypes,
  incrementIndex,
  resetIndex,
  removeBlockAtIndex,
  setCurrentLessonUUId,
} = blocksSlice.actions;

export default blocksSlice.reducer;