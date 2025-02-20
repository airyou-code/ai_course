import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { removeByTypes, addBlocks, updateProcBlock, endProcBlock } from '../../store/slices/blocksSlice';
import { useFetchChatHistory } from '@/hooks/openai';
import { useRefreshLogin } from '@/hooks/user';
import { ChatInput } from './content/chat-input';
import { streamChat } from '@/hooks/openai';

// @ts-ignore
const InputGptBlock = ({ block, blockRef }) => {
  const dispatch = useDispatch();
  const refreshLogin = useRefreshLogin();
  const { data: chatHistory } = useFetchChatHistory(block.uuid);

  const handleUserInput = (message: string) => {
    const blockId = block.uuid || block.post_uuid;
    dispatch(removeByTypes(['input_gpt', 'button_continue']));
    dispatch(
      addBlocks([
        { type: 'input_dialog', content: message },
        { type: 'text', content: 'Empty Box', is_processing: true, is_md: true },
        { type: 'input_gpt', content: '', post_uuid: blockId  },
        { type: 'button_continue', content: 'Continue' },
      ])
    );
    console.log('blockId', blockId);
    streamChat(blockId, message, dispatch, refreshLogin);
  };

  useEffect(() => {
    if (block.uuid && chatHistory?.length) {
      // Удаляем старый input_gpt и кнопку
      dispatch(removeByTypes(['input_gpt', 'button_continue']));

      // Превращаем историю в нужный формат блоков
      // @ts-ignore
      const historyBlocks = chatHistory.map((msg) => ({
        type: msg.role === 'user' ? 'input_dialog' : 'text',
        content: msg.content,
      }));

      // Добавляем историю и снова показываем поле ввода и кнопку
      dispatch(
        addBlocks([
          ...historyBlocks,
          { type: 'input_gpt', content: '', post_uuid: block.uuid },
          { type: 'button_continue', content: 'Continue' },
        ])
      );
    }
  }, [block.uuid, chatHistory, dispatch]);

  return (
    <div className="py-4" ref={blockRef}>
      <ChatInput onSubmit={handleUserInput} placeholder={block.content as string} />
    </div>
  );
};

export default InputGptBlock;