'use client';

import qs from 'query-string';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import Modal from "./Modal";
import Heading from '../Heading';
import useSearchModal from '@/hooks/useSearchModal';
import SkillLevelSelector from '../inputs/SkillLevelSelector';
import GenreSelector from '../inputs/GenreSelector';
import ToolsSelector from '../inputs/ToolsSelector';

enum SEARCH_STEPS {
    SKILL_LEVEL = 0,
    GENRE_STYLE = 1,
    TOOLS = 2,
}

const SearchModal = () => {
    const router = useRouter();
    const searchModal = useSearchModal();
    const params = useSearchParams();

    const [step, setStep] = useState(SEARCH_STEPS.SKILL_LEVEL);
    const [skillLevel, setSkillLevel] = useState('Beginner'); 
    const [genreStyle, setGenreStyle] = useState<string[]>([]);
    const [tools, setTools] = useState<string[]>([]);

    const onBack = useCallback(() => {
        setStep((value) => value - 1);
    }, []);

    const onNext = useCallback(() => {
        setStep((value) => value + 1);
    }, []);

    const onSubmit = useCallback(async () => {
        if (step !== SEARCH_STEPS.TOOLS) {
            return onNext();
        }

        let currentQuery = {};

        if (params) {
            currentQuery = qs.parse(params.toString())
        }

        const updatedQuery = {
            ...currentQuery,
            skillLevel,
            genreStyle: genreStyle.join(','),
            tools: tools.join(','),
          };

        const url = qs.stringifyUrl({
            url: '/coaching/',
            query: updatedQuery,
        }, { skipNull: true });

        searchModal.onClose();
        router.push(url);
    }, [step, searchModal, router, skillLevel, genreStyle, tools, onNext, params]);

    const actionLabel = useMemo(() => {
        if (step === SEARCH_STEPS.TOOLS) {
            return 'Search';
        }
        return 'Next';
    }, [step]);

    const secondaryActionLabel = useMemo(() => {
        if (step === SEARCH_STEPS.SKILL_LEVEL) {
            return undefined;
        }
        return 'Back';
    }, [step]);

    let bodyContent;
    switch(step) {
        case SEARCH_STEPS.SKILL_LEVEL:
            bodyContent = (
                <div className="flex flex-col gap-8 theme-transition">
                    <Heading
                        title="What's your skill level?"
                        subtitle="Pick a skill level that best represents you."
                    />
                    <SkillLevelSelector value={skillLevel} onChange={setSkillLevel} />
                </div>
            );
            break;
        case SEARCH_STEPS.GENRE_STYLE:
            bodyContent = (
                <div className="flex flex-col gap-8 theme-transition">
                    <Heading
                        title="Which genre/style do you prefer?"
                        subtitle="Select your preferred genre or style of music."
                    />
                    <GenreSelector value={genreStyle} onChange={setGenreStyle} />
                </div>
            );
            break;
        case SEARCH_STEPS.TOOLS:
            bodyContent = (
                <div className="flex flex-col gap-8 theme-transition">
                    <Heading
                        title="What tools/software do you use?"
                        subtitle="Select the main music production tool or software you use."
                    />
                    <ToolsSelector value={tools} onChange={setTools} />
                </div>
            );
            break;
    }

    return (
        <Modal
            isOpen={searchModal.isOpen}
            title="Find Your Mentor"
            actionLabel={actionLabel}
            onSubmit={onSubmit}
            secondaryActionLabel={secondaryActionLabel}
            secondaryAction={onBack}
            onClose={searchModal.onClose}
            body={bodyContent}
        />
    );
}

export default SearchModal;
