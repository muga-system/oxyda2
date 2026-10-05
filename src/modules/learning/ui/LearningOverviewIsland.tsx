import { useMemo } from 'react';
import type { Family, Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import { familyIllustrations } from '../../../shared/ui/illustrations';
import StorageNotice from '../../../components/react/StorageNotice';
import { StatusChip } from '../../../components/react/StatusChip';

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
      <ul className="family-rows" aria-label="Familias">
        {families.map((family, index) => {
          const familySkills = skills.filter(
            (skill) => skill.familyId === family.id,
          );
          const status = getFamilyStatus(
            progress.filter((entry) =>
              familySkills.some((skill) => skill.id === entry.skillId),
            ),
          );
          const art = familyIllustrations[family.id];
          return (
            <li key={family.id}>
              <a className="family-row" href={`/aprender/${family.slug}`}>
                <span className="family-row__art dots" aria-hidden="true">
                  <img src={art.src} width="88" height="88" alt="" />
                </span>
                <span className="family-row__body">
                  <span className="label">
                    {String(index + 1).padStart(2, '0')} — {family.title}
                  </span>
                  <span className="family-row__question">
                    {family.question}
                  </span>
                  <span className="family-row__description">
                    {family.description}
                  </span>
                </span>
                <span className="family-row__meta">
                  <StatusChip status={status} />
                  <span>{familySkills.length} conceptos →</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </>
  );
}
