import type { Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import StorageNotice from '../../../components/react/StorageNotice';
import { StatusChip } from '../../../components/react/StatusChip';

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
        <StatusChip status={status} />
        <a className="text-link" href="/mapa">
          Ver habilidades →
        </a>
      </div>
      <StorageNotice message={message} />
    </>
  );
}
