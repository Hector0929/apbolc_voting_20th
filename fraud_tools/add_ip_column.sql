-- Add ip_address column to votes table
ALTER TABLE votes 
ADD COLUMN ip_address text;

-- Create index for ip_address to facilitate future queries
CREATE INDEX idx_votes_ip_address ON votes(ip_address);

-- Optional: Comments for documentation
COMMENT ON COLUMN votes.ip_address IS 'IP address of the user when casting the vote';
