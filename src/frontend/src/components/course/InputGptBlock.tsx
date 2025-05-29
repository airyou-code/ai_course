import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { removeByTypes, addBlocksAfterBlock, addBlocks } from '../../store/slices/blocksSlice';
import { ChatInput } from './content/chat-input';
import { useFetchChatHistory } from '@/hooks/openai';
import { streamChat } from '@/hooks/openai';
import { useToast } from '@/hooks/use-toast';
import { useRefreshLogin } from '@/hooks/user';
import { useStreamStatus } from '@/reducers/StreamStatus';


// @ts-ignore
const InputGptBlock = ({ block }) => {
  // Всегда вызываем хуки, даже если block не определён
  const dispatch = useDispatch();
  const refreshLogin = useRefreshLogin();
  const {isStreaming, setIsStreaming} = useStreamStatus();
  const { toast } = useToast();


  // Если block отсутствует, используем дефолтные значения
  const blockUuid = block?.uuid || '';
  const blockParentId = block?.parent_uuid || '';

  if (!block) return null;

  return (
    <>
      <ChatInput onSubmit={(message) => {
        const blockId = blockUuid || block.post_uuid;
        console.log("Block id:", blockId);
        // Удаляем старые блоки для данного parent_uuid
        dispatch(removeByTypes({ types: ['input_gpt', 'button_continue'], parent_uuid: blockParentId }));
        // Добавляем новые блоки после родительского блока
        dispatch(
          addBlocks(
            [
              { parent_uuid: blockParentId, type: 'input_dialog', content: message },
              { parent_uuid: blockParentId, type: 'output_dialog', content: '', is_processing: true, is_init: true, is_md: true },
              { parent_uuid: blockParentId, type: 'input_gpt', content: '', post_uuid: blockId },
              { parent_uuid: blockParentId, type: 'button_continue', content: 'Continue' },
            ]
          )
        );
        setIsStreaming(true);
        streamChat(blockId, message, dispatch, setIsStreaming, refreshLogin, toast);
      }} isStreaming={isStreaming || false} />
    </>
  );
};

export default InputGptBlock;
