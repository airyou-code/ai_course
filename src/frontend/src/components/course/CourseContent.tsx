import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  showSeenBlocks,
  showNextBlocks,
  removeByTypes,
  addBlocks,
  clearBlocks,
  setCurrentLessonUUId,
} from '../../store/slices/blocksSlice';
import { useFetchLessonData, useFetchLessonHistory } from '../../hooks/courses';
import { useFetchChatHistory } from '@/hooks/openai';
import { DialogBox } from './content/dialog-box';
import { ChatInput } from './content/chat-input';
import { ContinueButton } from './content/continue-button';
import { Test } from './content/test';
import { NextLessonButton } from './content/next-lesson-button';
import DOMPurify from 'dompurify';
import InputGptBlock from './InputGptBlock';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

export default function CoursePage() {
  const { lessonUUId } = useParams<{ lessonUUId: string }>();
  if (!lessonUUId) {
    return <div>Error: lessonUUId is undefined</div>;
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const lastBlockRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { blocks, currentIndex, currentLessonUUId } = useSelector(
    (state: RootState) => state.blocks
  );

  const { data: fetchedData, isLoading, isError } = useFetchLessonData(lessonUUId);
  const { data: historyData } = useFetchLessonHistory(lessonUUId);

  useEffect(() => {
    if (currentLessonUUId !== lessonUUId) {
      dispatch(clearBlocks());
      dispatch(setCurrentLessonUUId(lessonUUId));
    }
  }, [lessonUUId, currentLessonUUId, dispatch]);

  useEffect(() => {
    if (fetchedData?.blocks?.length && currentIndex === 0) {
      // Если есть last_seen_block_uuid, показываем блоки до и включая этот UUID
      if (historyData && historyData.last_seen_block_uuid) {
          dispatch(showSeenBlocks(
            {blocks: fetchedData.blocks, lastSeenUUID: historyData.last_seen_block_uuid}
          ));
      } else {
        dispatch(showNextBlocks(fetchedData.blocks));
      }
    }
  }, [fetchedData, currentIndex, dispatch, historyData]);

  useEffect(() => {
    if (lastBlockRef.current) {
      lastBlockRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [blocks]);

  const renderBlock = (block: any, index: number) => {
    const isSecondLastBlock = index === blocks.length - 2;
    const blockRef = isSecondLastBlock ? lastBlockRef : null;

    switch (block.type) {
      case 'output_dialog':
      case 'input_dialog':
        return (
          <div key={index} ref={blockRef}>
            <DialogBox
              content={block.content as string}
              is_md={block.is_md || false}
              isInput={block.type === 'input_dialog'}
            />
          </div>
        );
      case 'text':
        return (
          <div key={index} className="py-4 px-2" ref={blockRef}>
            {(block.is_md || false) ? ( 
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                {block.content}
              </ReactMarkdown>
            ) : (
              <div
              className="tinymce-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
              ></div>
            )}
          </div>
        );
      case 'input_gpt':
        return (
          <div key={index} className="py-4" ref={blockRef}>
            <InputGptBlock
              block={block}
            />
          </div>
        );
      case 'button_continue':
        return (
          <div key={index} className="flex justify-center" ref={blockRef}>
            <ContinueButton
              content={block.content as string}
              onClick={() => {
                dispatch(removeByTypes({types: ['input_gpt', 'button_continue']}));
                if (fetchedData && fetchedData.blocks) {
                  dispatch(showNextBlocks(fetchedData.blocks));
                }
              }}
            />
          </div>
        );
      case "button_next":
          return block.nextLessonUrl ? (
            <NextLessonButton
              key={index}
              url={block.nextLessonUrl}
            />
          ) : null
      default:
        return null;
    }
  };

  if (isLoading) return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto pb-10">
        <div ref={containerRef} className="max-w-3xl mx-auto p-4 space-y-6" style={{ maxHeight: '80vh' }}>
          <div className="space-y-6 pb-10">
          <div className="flex justify-center items-center h-full">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-black"></div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
  if (isError) return <div>Error fetching data</div>;

  return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto pb-10">
        <div ref={containerRef} className="max-w-3xl mx-auto p-4 space-y-6" style={{ maxHeight: '80vh' }}>
          <div className="space-y-6 pb-10">
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        </div>
      </div>
    </main>
  );
}

