import { useMemo } from 'react';
import type { Family, FamilyId, Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import StorageNotice from '../../../components/react/StorageNotice';
import { ArrowUpRightIcon } from '../../../components/react/icons/arrow';

const familySignals: Record<
  FamilyId,
  { expression: string; explanation: string }
> = {
  percentage: { expression: '25%', explanation: 'parte de un total' },
  proportion: { expression: '3 : 5', explanation: 'relación que se mantiene' },
  estimation: { expression: '≈ 500', explanation: 'orden posible' },
  units: { expression: '1000 m → 1 km', explanation: 'misma medida' },
  data: { expression: '10 · 12 · 14', explanation: 'leer el centro' },
};

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
              <div className="family-index" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="family-index__line" />
              </div>
              <div className="learning-family-content">
                <div
                  className="family-signal"
                  aria-label={familySignals[family.id].explanation}
                >
                  <code>{familySignals[family.id].expression}</code>
                  <span>{familySignals[family.id].explanation}</span>
                </div>
                <div className="family-title-row">
                  <h2>{family.title}</h2>
                  <span className="status">{status}</span>
                </div>
                <p>{family.description}</p>
                <div className="family-meta">
                  <span>{familySkills.length} conceptos</span>
                  <span>{family.question}</span>
                </div>
              </div>
              <ArrowUpRightIcon
                className="family-arrow"
                size={18}
                reducedMotion
              />
            </a>
          );
        })}
      </div>
    </>
  );
}
