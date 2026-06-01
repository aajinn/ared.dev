-- New content sections for admin features
INSERT INTO content (section, data) VALUES
  ('theme', '{"mode": "dark", "background": "#0a0a0f", "surface": "#0e0e16", "surfaceAlt": "#1a1a2e", "border": "#1e1e2e", "textPrimary": "#e8e8f0", "textSecondary": "#7070a0", "textMuted": "#555570", "accent": "#6060a0", "accentHover": "#8080c0", "primary": "#ffffff"}'),
  ('pages', '{"items": []}'),
  ('layout', '{"sections": [{"key": "hero", "label": "Hero", "visible": true}, {"key": "reviews", "label": "Reviews", "visible": true}, {"key": "skills", "label": "Skills", "visible": true}, {"key": "experience", "label": "Experience", "visible": true}, {"key": "projects", "label": "Projects", "visible": true}, {"key": "contact", "label": "Contact", "visible": true}, {"key": "footer", "label": "Footer", "visible": true}]}')
ON CONFLICT (section) DO NOTHING;


