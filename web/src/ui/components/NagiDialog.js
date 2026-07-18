export class NagiDialog {
  static show(container, { title, body, dismiss = '取消', confirm = '确认', onDismiss, onConfirm }) {
    const el = document.createElement('div');
    el.className = 'nagi-dialog-scrim';
    el.innerHTML = `
      <div class="nagi-dialog-card cut-medium">
        <div class="nagi-dialog-title">${title}</div>
        ${body ? `<div class="nagi-dialog-body">${body}</div>` : ''}
        <div class="nagi-dialog-actions">
          <span class="nagi-dialog-dismiss" data-role="dismiss">${dismiss}</span>
          <span class="nagi-dialog-confirm" data-role="confirm">${confirm}</span>
        </div>
      </div>
    `;

    const close = () => el.remove();

    el.querySelector('[data-role="dismiss"]').addEventListener('click', (e) => {
      e.stopPropagation();
      close();
      if (onDismiss) onDismiss();
    });

    el.querySelector('[data-role="confirm"]').addEventListener('click', (e) => {
      e.stopPropagation();
      close();
      if (onConfirm) onConfirm();
    });

    el.addEventListener('click', (e) => {
      if (e.target === el) {
        e.stopPropagation();
        close();
        if (onDismiss) onDismiss();
      }
    });

    container.appendChild(el);
    return { close };
  }

  static confirm(container, { title, body, dismiss = '取消', confirm = '确认' }) {
    return new Promise((resolve) => {
      NagiDialog.show(container, {
        title,
        body,
        dismiss,
        confirm,
        onDismiss: () => resolve(false),
        onConfirm: () => resolve(true),
      });
    });
  }
}
