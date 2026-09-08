import type { Skill } from '../../../shared/domain/types';
import { useProgress } from '../../progress/ui/useProgress';
import {
  getFamilyStatus,
  getSkillProgress,
} from '../../progress/domain/progress';
import StorageNotice from '../../../components/react/StorageNotice';
import { AnimatedArrowLink } from '../../../components/react/AnimatedArrowAction';

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
        <AnimatedArrowLink
          href="/mapa"
          className="text-link"
          direction="up-right"
        >
          Ver habilidades
        </AnimatedArrowLink>
      </div>
      <StorageNotice message={message} />
    </>
  );
}
