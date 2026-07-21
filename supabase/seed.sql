-- Seed active news sources for Update Me pipeline
INSERT INTO public.sources (name, listing_url, parser_strategy, active, logo_url)
VALUES 
  ('Reuters', 'https://www.reuters.com', 'reuters', true, 'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-default-png.png'),
  ('BBC News', 'https://www.bbc.com/news', 'bbc', true, 'https://nav.files.bbci.co.uk/orbit/3.0.0-681.4e164ae1/img/blot-dark.svg'),
  ('NPR News', 'https://www.npr.org', 'npr', true, 'https://media.npr.org/images/logo/npr-logo-black.png'),
  ('Fox News', 'https://www.foxnews.com', 'fox', true, 'https://static.foxnews.com/static/orion/styles/img/fox-news/og/fox-news.png'),
  ('The Guardian', 'https://www.theguardian.com/us', 'guardian', true, 'https://assets.guim.co.uk/images/guardian-logo-100.png')
ON CONFLICT (listing_url) DO UPDATE SET active = EXCLUDED.active;
