-- Seed active news sources for Update You pipeline (including Sports, Weather, Business, and Tech)
INSERT INTO public.sources (name, listing_url, parser_strategy, active, logo_url)
VALUES 
  ('Reuters', 'https://www.reuters.com', 'reuters', true, 'https://www.reuters.com/pf/resources/images/reuters/logo-vertical-default-png.png'),
  ('BBC News', 'https://www.bbc.com/news', 'bbc', true, 'https://nav.files.bbci.co.uk/orbit/3.0.0-681.4e164ae1/img/blot-dark.svg'),
  ('NPR News', 'https://www.npr.org', 'npr', true, 'https://media.npr.org/images/logo/npr-logo-black.png'),
  ('Fox News', 'https://www.foxnews.com', 'fox', true, 'https://static.foxnews.com/static/orion/styles/img/fox-news/og/fox-news.png'),
  ('The Guardian', 'https://www.theguardian.com/us', 'guardian', true, 'https://assets.guim.co.uk/images/guardian-logo-100.png'),
  ('ESPN', 'https://www.espn.com', 'espn', true, 'https://a.espncdn.com/i/espn/espn_logo.png'),
  ('BBC Sport', 'https://www.bbc.com/sport', 'bbc_sport', true, 'https://nav.files.bbci.co.uk/orbit/3.0.0-681.4e164ae1/img/blot-dark.svg'),
  ('AccuWeather', 'https://www.accuweather.com', 'accuweather', true, 'https://www.accuweather.com/images/logos/accuweather-logo.png'),
  ('CNBC', 'https://www.cnbc.com', 'cnbc', true, 'https://sc.cnbcfm.com/applications/cnbc.com/static-[#VERSION#]/doc/cnbc-logo.png'),
  ('Fortune', 'https://www.fortune.com', 'fortune', true, 'https://fortune.com/wp-content/uploads/2021/04/fortune-logo.png'),
  ('TechCrunch', 'https://techcrunch.com', 'techcrunch', true, 'https://techcrunch.com/wp-content/uploads/2015/02/tc-logo.png')
ON CONFLICT (listing_url) DO UPDATE SET active = EXCLUDED.active;
