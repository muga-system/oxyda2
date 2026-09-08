import { useMemo } from 'react';
import type { Family, Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import StorageNotice from '../../../components/react/StorageNotice';

export default function LearningOverviewIsland({
  families,
  skills,
}: {
  families: Family[];
  skills: Skill[];
}) {
  const { snapshot, message } = useProgress();
  const progress = useMemo(
    () =>
      skills.map((skill) =>
        getSkillProgress(skill.id, snapshot.evidences, new Date()),
      ),
    [skills, snapshot.evidences],
  );
  return (
    <>
      <StorageNotice message={message} />
      <div className="learning-families">
        {families.map((family, index) => {
          const familySkills = skills.filter(
            (skill) => skill.familyId === family.id,
          );
          const status = getFamilyStatus(
            progress.filter((entry) =>
              familySkills.some((skill) => skill.id === entry.skillId),
            ),
          );
          return (
            <a
              className="learning-family"
              href={`/aprender/${family.slug}`}
              key={family.id}
            >
              <span className="family-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="learning-family-content">
                <div className="family-title-row">
                  <h2>{family.title}</h2>
                  <span className="status">{status}</span>
                </div>
                <p>{family.description}</p>
                <span className="family-question">{family.question}</span>
                <span className="family-concepts">
                  {familySkills.map((skill) => skill.title).join(' · ')}
                </span>
              </div>
              <span className="family-arrow" aria-hidden="true">
                ↗
              </span>
            </a>
          );
        })}
      </div>
    </>
  );
}
