import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { removeByTypes, addBlocksAfterBlock } from '../../store/slices/blocksSlice';
import { ChatInput } from './content/chat-input';
import { useFetchChatHistory } from '@/hooks/openai';
import { streamChat } from '@/hooks/openai';
import { useRefreshLogin } from '@/hooks/user';


// @ts-ignore
const InputGptBlock = ({ block }) => {
  // Всегда вызываем хуки, даже если block не определён
  const dispatch = useDispatch();
  const refreshLogin = useRefreshLogin();

  // Если block отсутствует, используем дефолтные значения
  const blockUuid = block?.uuid || '';
  const blockParentId = block?.parent_uuid || '';

  // Вызываем хук с безопасным идентификатором (даже если он пустой)
  const { data: chatHistory } = useFetchChatHistory(blockUuid);
  const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];
  const hasAddedHistory = useRef(false);

  useEffect(() => {
    // Если block не определён, ничего не делаем
    if (!block) return;

    // Если история ещё не добавлена и есть данные из chatHistory
    if (!hasAddedHistory.current && blockUuid && safeChatHistory.length > 0) {
      hasAddedHistory.current = true;
      // Удаляем старые блоки для данного parent_uuid
      dispatch(removeByTypes({ types: ['input_gpt', 'button_continue'], parent_uuid: blockParentId }));

      // Преобразуем историю в блоки нужного формата
      const historyBlocks = safeChatHistory.map((msg) => ({
        type: msg.role === 'user' ? 'input_dialog' : 'text',
        content: msg.content,
        parent_uuid: blockParentId,
      }));

      // Добавляем историю сразу после родительского блока, а затем добавляем поле ввода и кнопку
      dispatch(
        addBlocksAfterBlock({
          blocks: [
            ...historyBlocks
          ],
          parent_uuid: blockParentId,
          extraBlocks: [
            { parent_uuid: blockParentId, type: 'input_gpt', content: '', post_uuid: blockUuid },
            { parent_uuid: blockParentId, type: 'button_continue', content: 'Continue' },
          ]
        })
      );
    }
  }, [block, blockUuid, blockParentId, safeChatHistory, dispatch, refreshLogin]);

  // Если block не определён, возвращаем null (после вызова всех хуков)
  if (!block) return null;

  return (
    <>
      <ChatInput onSubmit={(message) => {
        const blockId = blockUuid || block.post_uuid;
        // Удаляем старые блоки для данного parent_uuid
        dispatch(removeByTypes({ types: ['input_gpt', 'button_continue'], parent_uuid: blockParentId }));
        // Добавляем новые блоки после родительского блока
        dispatch(
          addBlocksAfterBlock({
            blocks: [
              { parent_uuid: blockParentId, type: 'input_dialog', content: message },
              { parent_uuid: blockParentId, type: 'text', content: 'Empty Box', is_processing: true, is_md: true },
              { parent_uuid: blockParentId, type: 'input_gpt', content: '', post_uuid: blockId },
              { parent_uuid: blockParentId, type: 'button_continue', content: 'Continue' },
            ],
            parent_uuid: blockParentId,
          })
        );
        streamChat(blockId, message, dispatch, refreshLogin);
      }} placeholder={block.content || ''} />
    </>
  );
};

export default InputGptBlock;
