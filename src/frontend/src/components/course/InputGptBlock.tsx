import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { removeByTypes, addBlocks } from '../../store/slices/blocksSlice';
import { useFetchChatHistory } from '@/hooks/openai';
import { ChatInput } from './content/chat-input';
// @ts-ignore
const InputGptBlock = ({ block, blockRef }) => {
  const dispatch = useDispatch();
  const { data: chatHistory } = useFetchChatHistory(block.uuid);

  const handleUserInput = (message: string) => {
    dispatch(removeByTypes(['input_gpt', 'button_continue']));
    dispatch(
      addBlocks([
        { type: 'input_dialog', content: message },
        { type: 'text', content: 'Mock answer from server' },
        { type: 'input_gpt', content: '', post_uuid: block.uuid  },
        { type: 'button_continue', content: 'Continue' },
      ])
    );
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