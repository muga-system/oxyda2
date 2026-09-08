import type { Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import StorageNotice from '../../../components/react/StorageNotice';
import { ArrowUpRightIcon } from '../../../components/react/icons/arrow';

export default function FamilyStatusIsland({ skills }: { skills: Skill[] }) {
  const { snapshot, message } = useProgress();
  const status = getFamilyStatus(
    skills.map((skill) =>
      getSkillProgress(skill.id, snapshot.evidences, new Date()),
    ),
  );
  return (
    <>
      <div className="family-local-status">
        <span>En tu mapa</span>
        <span className="status">{status}</span>
        <a href="/mapa" className="text-link">
          Ver habilidades <ArrowUpRightIcon size={16} reducedMotion />
        </a>
      </div>
      <StorageNotice message={message} />
    </>
  );
}
