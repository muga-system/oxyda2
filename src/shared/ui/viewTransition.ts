import { flushSync } from 'react-dom';

interface ViewTransitionDocument {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
}

/**
 * Updates an interactive island with the native View Transition API when it is
 * available, while keeping the current reading position stable as the panel
 * changes height.
 */
export function runViewTransition(
  update: () => void,
  options: { preserveWorkspaceScroll?: boolean } = {},
): void {
  const preserveWorkspaceScroll = options.preserveWorkspaceScroll ?? true;
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const workspace = document.querySelector<HTMLElement>(
    '.challenge-workspace__inner, .challenge-shell',
  );
  const workspaceScrollTop = preserveWorkspaceScroll
    ? (workspace?.scrollTop ?? 0)
    : 0;
  const restoreScroll = () => {
    window.scrollTo(scrollX, scrollY);
    if (workspace) workspace.scrollTop = workspaceScrollTop;
  };
  const settleScroll = () => {
    restoreScroll();
    requestAnimationFrame(restoreScroll);
    setTimeout(restoreScroll, 0);
  };
  const transitionDocument = document as ViewTransitionDocument;
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (!transitionDocument.startViewTransition || reducedMotion) {
    update();
    settleScroll();
    return;
  }

  const transition = transitionDocument.startViewTransition(() =>
    flushSync(update),
  );
  settleScroll();
  transition.finished.then(restoreScroll).catch(() => undefined);
}
