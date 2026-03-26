-- 1. Ensure Table Structure is correct
CREATE TABLE IF NOT EXISTS public.hero_sliders (
  id text PRIMARY KEY,
  image text,
  headline text,
  subheading text,
  description text,
  button_text text,
  button_link text,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add description column if missing (extra safety)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='hero_sliders' AND column_name='description') THEN 
        ALTER TABLE public.hero_sliders ADD COLUMN description text; 
    END IF; 
END $$;

-- 3. Restore/Update 5 Core Hero Slides
INSERT INTO public.hero_sliders (id, image, headline, subheading, description, button_text, button_link, active)
VALUES 
('1', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070', 'Make Your Dream Home A Reality.', 'Mortgage Assistance Solutions', 'Navigate the home buying process with confidence. We offer tailored mortgage support with competitive options and end-to-end guidance.', 'Apply for Home Loan', '/contact', true),
('2', 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=2070', 'Fueling Your Business Growth.', 'Business & MSME Capital', 'Empower your enterprise with flexible loan options. Whether it is for expansion or working capital, we help find the financial support your business needs.', 'Grow Your Business', '/contact', true),
('3', 'https://images.unsplash.com/photo-1621348160394-21312384918e?q=80&w=2070', 'Financial Support for Your Personal Goals.', 'Flexible Personal Lending', 'From important life events to unexpected needs, access funds through our streamlined digital application process with efficient disbursal.', 'Explore Personal Loans', '/contact', true),
('4', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070', 'Maximize the Potential of Your Assets.', 'Loan Against Property', 'Utilize your residential or commercial property to secure high-value funding. Enjoy attractive rates and structured repayment tenures with our guidance.', 'Unlock Property Value', '/services', true),
('5', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070', 'Drive Your Ambitions Forward.', 'Transparent Auto Financing', 'Simplify your vehicle purchase with funding options for new and used cars. Benefit from efficient processing and attractive rates to get you on the road.', 'Check Eligibility', '/emi-calculator', true)
ON CONFLICT (id) DO UPDATE SET
    image = EXCLUDED.image,
    headline = EXCLUDED.headline,
    subheading = EXCLUDED.subheading,
    description = EXCLUDED.description,
    button_text = EXCLUDED.button_text,
    button_link = EXCLUDED.button_link,
    active = EXCLUDED.active;

