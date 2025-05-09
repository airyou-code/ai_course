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
import { useFetchNextLessonData } from "@/hooks/courses";

import { DialogBox } from './content/dialog-box';
import { ChatInput } from './content/chat-input';
import { ContinueButton } from './content/continue-button';
import { Test } from './content/test';
import { NextLessonButton } from './content/next-lesson-button';
import LessonReview from './content/lesson-review';

import DOMPurify from 'dompurify';
import InputGptBlock from './InputGptBlock';
import { useLessonProgress } from '@/reducers/LessonProgress';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

import {
  SkeletonLoader
} from '../ui/loader';

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
  const { progress, setProgress } = useLessonProgress();
  const { refetch: fetchNext } = useFetchNextLessonData(lessonUUId);

  const handleContinue = async () => {
    dispatch(removeByTypes({types: ['input_gpt', 'button_continue']}));
    dispatch(
      addBlocks(
        [
          {type: 'loading', content: "" },
          {type: 'button_skeleton', content: "" },
        ]
      )
    );
    const { data } = await fetchNext();
    console.log(data);
    if (data) {
      dispatch(removeByTypes({types: ['loading', 'button_skeleton']}));
      dispatch(addBlocks(data.blocks));
      setProgress(data.procent_progress);
    }
  };

  useEffect(() => {
    dispatch(clearBlocks());
    if (currentLessonUUId !== lessonUUId) {
      dispatch(setCurrentLessonUUId(lessonUUId));
    }
  }, [lessonUUId, currentLessonUUId, dispatch]);

  useEffect(() => {
    if (fetchedData?.blocks?.length && currentIndex === 0) {
        dispatch(addBlocks(fetchedData.blocks));
        setProgress(fetchedData.procent_progress);
    }
  }, [fetchedData, currentIndex, dispatch]);

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
        return (
          <div key={index}>
            <DialogBox
              content={block.content as string}
              is_md={block.is_md || false}
              is_init={block.is_init || false}
              is_error={block.is_error || false}
              error_msg={block.error_msg || ""}
              isInput={block.type === 'input_dialog'}
            />
          </div>
        );
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
      case 'lesson_review':
        return (
          <div key={index} className="pb-4" ref={blockRef}>
            <LessonReview/>
          </div>
        );
      case 'button_continue':
        return (
          <div key={index} className="flex justify-center" ref={blockRef}>
            <ContinueButton
              content={block.content as string}
              onClick={handleContinue}
            />
          </div>
        );
      case "button_next":
          return block.nextLessonUrl ? (
            <NextLessonButton
              key={index}
              content={block.content as string}
              url={block.nextLessonUrl}
            />
          ) : <NextLessonButton
            key={index}
            content="Select the next module"
            url={'/'}
          />;
      case "loading":
        return (
          <div className="py-4 px-2">
            <SkeletonLoader count={4} />
          </div>
        );
      case "button_skeleton":
        return (
          <div className="py-4 px-2">
            <div className="h-4 bg-muted rounded animate-pulse w-1/4" />
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) return (
    <main className="flex-1">
      <div className="max-w-3xl mx-auto pb-10">
        <div ref={containerRef} className="max-w-3xl mx-auto p-4 space-y-6" style={{ maxHeight: '80vh' }}>
          <div className="space-y-6 pb-10">
            <div className="py-4 px-2">
              <SkeletonLoader count={10} />
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
            <div className="pt-4 px-2 tinymce-content">
              <h1>
                {fetchedData.title.replace(/^.*\$\.\s*/, "")}
              </h1>
            </div>
            {blocks.map((block, index) => renderBlock(block, index))}
          </div>
        </div>
      </div>
    </main>
  );
}

