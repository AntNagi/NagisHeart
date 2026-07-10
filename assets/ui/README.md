# Nagi's Heart UI Asset Pack v1.0

> 用途：给 Android 重构首轮使用的 UI 切图 / 图标资源。  
> 视觉语言：冷光玫瑰 + Blue Lock 感五边形几何。  
> 注意：这些是原创抽象几何资源，不直接复制 Blue Lock 官方 Logo。

## 目录

```text
assets/ui/svg/
assets/ui/android/drawable/
```

## 使用建议

- SVG 用于设计预览、Web 样张和后续导出。
- Android XML 可直接复制到 `res/drawable/`。
- Android 里建议统一通过 tint 控制颜色。
- 默认线色为 `#AEBAC8`，选中态建议 tint 为 `#BFA08A`。

## 资源清单

| 资源 | 用途 |
|---|---|
| `ic_pentagon_ring` | 五边形环，通用装饰 / Choice marker |
| `ic_pentagon_fill` | 五边形实心，当前节点 / Active marker |
| `ic_back` | HUD 返回 |
| `ic_menu` | HUD 菜单 |
| `ic_auto` | Auto |
| `ic_skip` | Skip |
| `ic_backlog` | Backlog |
| `ic_save` | Save / Load |
| `ic_chapter` | Chapter Map |
| `ic_gallery` | Gallery |
| `ic_settings` | Settings |
| `ic_line` | LINE mode |
| `ic_lock` | Locked / 未解锁 |
| `ic_continue` | 点击继续提示 |

## 颜色建议

```text
default light: #6E7A89
default dark:  #C9D1DC
muted line:    #AEBAC8
active:        #BFA08A
true end:      #D8C38A
danger:        #7A3F4A
```

