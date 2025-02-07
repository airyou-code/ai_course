import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import {
  removeBlockAtIndex,
  showNextBlocks,
  removeByTypes,
  addBlocks,
  clearBlocks,
  setCurrentLessonUUId,
} from '../../store/slices/blocksSlice';
import { useFetchLessonData } from '../../hooks/courses';
import { DialogBox } from './content/dialog-box';
import { ChatInput } from './content/chat-input';
import { ContinueButton } from './content/continue-button';
import { Test } from './content/test';
import { NextLessonButton } from './content/next-lesson-button';
import DOMPurify from 'dompurify';

export default function CoursePage({ lessonUUId }: { lessonUUId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastBlockRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const { blocks, currentIndex, currentLessonUUId } = useSelector(
    (state: RootState) => state.blocks
  );

  const { data: fetchedData, isLoading, isError } = useFetchLessonData(lessonUUId);


  if (currentLessonUUId !== lessonUUId) {
    dispatch(clearBlocks());
    dispatch(setCurrentLessonUUId(lessonUUId));
    dispatch(showNextBlocks(fetchedData.blocks));
  }

  useEffect(() => {
    if (fetchedData?.blocks?.length && currentIndex === 0) {
      dispatch(showNextBlocks(fetchedData.blocks));
    }
  }, [fetchedData]);

  useEffect(() => {
    if (lastBlockRef.current) {
      lastBlockRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [blocks]);

  const handleUserInput = (message: string) => {
    dispatch(removeByTypes(['input_gpt', 'button_continue']));
    dispatch(
      addBlocks([
        { type: 'input_dialog', content: message },
        { type: 'output_dialog', content: 'Mock answer from server' },
        { type: 'input_gpt', content: '' },
        { type: 'button_continue', content: 'Continue' },
      ])
    );
  };

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
              isInput={block.type === 'input_dialog'}
            />
          </div>
        );
      case 'text':
        return (
          <div key={index} className="py-4 px-2" ref={blockRef}>
            <div
              className="tinymce-content"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.content) }}
            ></div>
          </div>
        );
      case 'input_gpt':
        return (
          <div key={index} className="py-4" ref={blockRef}>
            <ChatInput onSubmit={handleUserInput} placeholder={block.content as string} />
          </div>
        );
      case 'button_continue':
        return (
          <div key={index} className="flex justify-center" ref={blockRef}>
            <ContinueButton
              content={block.content as string}
              onClick={() => {
                dispatch(removeByTypes(['input_gpt', 'button_continue']));
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
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto pb-10">
        <div className="max-w-3xl mx-auto p-4 space-y-6" style={{ maxHeight: '80vh' }}>
          <div className="space-y-6 pb-10">
          <div className="flex justify-center items-center h-full">
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
  if (isError) return <div>Error fetching data</div>;

  return (
    <main className="flex-1 ml-64 p-8 overflow-y-auto">
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

