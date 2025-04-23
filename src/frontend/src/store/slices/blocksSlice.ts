import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ContentBlock {
  type: string;
  content: string;
  error_msg?: string;
  is_md?: boolean;
  block_id?: string;
  is_processing?: boolean;
  is_error?: boolean;
  is_init?: boolean;
  post_uuid?: string;
  uuid?: string;
  parent_uuid?: string;
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
        let previousUuid: string = "";
        if (index > 0) {
          previousUuid = externalBlocks[index - 1].uuid || "";
        }
        let block = externalBlocks[index];
        block = { ...block, parent_uuid: previousUuid };
        state.blocks.push(block);
        index++;
        if (block.type === "button_continue" || block.type === "input_gpt") {
          break;
        }
      }
      state.currentIndex = index;
    },
    showSeenBlocks: (
      state, action: PayloadAction<{ blocks: ContentBlock[]; lastSeenUUID: string }>
    ) => {
      const { blocks: externalBlocks, lastSeenUUID } = action.payload;
      const idx = externalBlocks.findIndex((b) => b.uuid === lastSeenUUID);
      let index = state.currentIndex;
    
      if (idx === -1) {
        while (index < externalBlocks.length) {
          let previousUuid: string = "";
          if (index > 0) {
            previousUuid = externalBlocks[index - 1].uuid || "";
          }
          let block = externalBlocks[index];
          block = { ...block, parent_uuid: previousUuid };
          state.blocks.push(block);
          index++;
          if (block.type === "button_continue" || block.type === "input_gpt") {
            break;
          }
        }
        state.currentIndex = index;
      }

      while (index < externalBlocks.length) {
        let previousUuid: string = "";
        if (index > 0) {
          previousUuid = externalBlocks[index - 1].uuid || "";
        }
        let block = externalBlocks[index];
        block = { ...block, parent_uuid: previousUuid };
        state.blocks.push(block);
        index++;
        if (index > idx) {
          if (block.type === 'button_continue' || block.type === 'input_gpt') {
            break;
          }
        }
      }
      state.currentIndex = index;
    },
    addBlocks: (state, action: PayloadAction<ContentBlock[]>) => {
      state.blocks = [...state.blocks, ...action.payload];
    },
    addBlocksAfterBlock: (
      state,
      action: PayloadAction<{
        blocks: ContentBlock[];
        parent_uuid: string;
        extraBlocks?: ContentBlock[];
      }>
    ) => {
      const { blocks: newBlocks, parent_uuid, extraBlocks } = action.payload;
      const index = state.blocks.findIndex((block) => block.uuid === parent_uuid);
    
      if (index !== -1) {
        // Если extraBlocks переданы И родительский блок является последним в списке,
        // то вставляем сначала новые блоки, затем extraBlocks.
        if (extraBlocks && index === state.blocks.length - 1) {
          state.blocks = [
            ...state.blocks.slice(0, index + 1),
            ...newBlocks,
            ...extraBlocks,
            ...state.blocks.slice(index + 1),
          ];
        } else {
          // Иначе просто вставляем новые блоки после родительского
          state.blocks = [
            ...state.blocks.slice(0, index + 1),
            ...newBlocks,
            ...state.blocks.slice(index + 1),
          ];
        }
      }
      return state;
    },
    removeByTypes: (state, action: PayloadAction<{ types: string[], parent_uuid?: string }>) => {
      const { types, parent_uuid = "" } = action.payload;
      if (parent_uuid) {
        state.blocks = state.blocks.filter(
          (block) => !types.includes(block.type) || block.parent_uuid !== parent_uuid
        );
      } else {
        state.blocks = state.blocks.filter(
          (block) => !types.includes(block.type)
        );
      }
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
    updateBlockById: (state, action: PayloadAction<{ block_id: string, content: string }>) => {
      const { block_id, content } = action.payload;
      const block = state.blocks.find(block => block.block_id === block_id);
      if (block) {
        block.content = content;
        block.is_init = false;
      }
    },
    updateBlockId: (state, action: PayloadAction<{ block_id: string, content: string }>) => {
      const { block_id, content } = action.payload;
      const block = state.blocks.find(block => block.block_id === block_id);
      if (block) {
        block.content = content;
        block.is_init = false;
      }
    },
    updateProcBlock: (state, action: PayloadAction<{ content: string }>) => {
      const { content } = action.payload;
      const block = state.blocks.find(block => block.is_processing === true);
      if (block) {
        block.content = content;
        block.is_init = false;
      }
    },
    endProcBlock: (state) => {
      const block = state.blocks.find(block => block.is_processing === true);
      if (block) {
        block.is_processing = false;
      }
    },
    setProcBlockError: (state, action: PayloadAction<string>) => {
      const errorMessage = action.payload;
      const block = state.blocks.find(block => block.is_processing === true);
      if (block) {
        block.error_msg = errorMessage;
        block.is_processing = false;
        block.is_error = true;
        block.is_init = false;
      }
    }
  },
});

export const {
  setBlocks,
  clearBlocks,
  showNextBlocks,
  addBlocks,
  addBlocksAfterBlock,
  removeByTypes,
  incrementIndex,
  resetIndex,
  removeBlockAtIndex,
  setCurrentLessonUUId,
  updateBlockById,
  updateProcBlock,
  endProcBlock,
  showSeenBlocks,
  setProcBlockError,
} = blocksSlice.actions;

export default blocksSlice.reducer;