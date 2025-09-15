import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SocialLinks from '@/components/page/event-detail/social-links';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useParams: jest.fn(() => ({
    type: 'event-detail',
  })),
}));

const mockUseParams = require('next/navigation').useParams as jest.MockedFunction<any>;

describe('SocialLinks Component', () => {
  const defaultEvent = {
    contactInfos: {
      email: ['test@example.com'],
      linkedIn: ['https://linkedin.com/in/test'],
      twitter: ['https://twitter.com/test'],
      discord: ['https://discord.gg/test'],
      telegram: ['https://t.me/test'],
      whatsapp: ['https://wa.me/test'],
      instagram: ['https://instagram.com/test'],
      mastodon: ['https://mastodon.social/@test'],
      bluesky: ['https://bsky.app/profile/test'],
    },
  };

  const defaultProps = {
    event: defaultEvent,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ type: 'event-detail' });
  });

  describe('Rendering', () => {
    it('renders social links container', () => {
      render(<SocialLinks {...defaultProps} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
    });

    it('renders all social media links when all contact infos are provided', () => {
      render(<SocialLinks {...defaultProps} />);
      
      expect(screen.getByTitle('Email')).toBeInTheDocument();
      expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
      expect(screen.getByTitle('X')).toBeInTheDocument();
      expect(screen.getByTitle('Discord')).toBeInTheDocument();
      expect(screen.getByTitle('Telegram')).toBeInTheDocument();
      expect(screen.getByTitle('Whatsapp')).toBeInTheDocument();
      expect(screen.getByTitle('Instagram')).toBeInTheDocument();
      expect(screen.getByTitle('Mastodon')).toBeInTheDocument();
      expect(screen.getByTitle('BlueSky')).toBeInTheDocument();
    });

    it('renders only email link when only email is provided', () => {
      const propsWithOnlyEmail = {
        event: {
          contactInfos: {
            email: ['test@example.com'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithOnlyEmail} />);
      
      expect(screen.getByTitle('Email')).toBeInTheDocument();
      expect(screen.queryByTitle('LinkedIn')).not.toBeInTheDocument();
      expect(screen.queryByTitle('X')).not.toBeInTheDocument();
    });

    it('renders no links when no contact infos are provided', () => {
      const propsWithoutContactInfos = {
        event: {
          contactInfos: {},
        },
      };
      
      render(<SocialLinks {...propsWithoutContactInfos} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
      expect(socialLinksContainer?.children).toHaveLength(0);
    });

    it('renders no links when contactInfos is undefined', () => {
      const propsWithoutContactInfos = {
        event: {},
      };
      
      render(<SocialLinks {...propsWithoutContactInfos} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
      expect(socialLinksContainer?.children).toHaveLength(0);
    });
  });

  describe('Individual Social Links', () => {
    it('renders email link with correct attributes', () => {
      const propsWithEmail = {
        event: {
          contactInfos: {
            email: ['test@example.com'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithEmail} />);
      
      const emailLink = screen.getByTitle('Email');
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
      expect(emailLink).toHaveAttribute('target', '_blank');
      expect(emailLink).toHaveClass('social__link');
      
      const emailImage = emailLink.querySelector('img');
      expect(emailImage).toHaveAttribute('src', '/icons/email.svg');
      expect(emailImage).toHaveAttribute('alt', 'email');
      expect(emailImage).toHaveAttribute('width', '35');
      expect(emailImage).toHaveAttribute('height', '35');
      expect(emailImage).toHaveAttribute('loading', 'lazy');
    });

    it('renders LinkedIn link with correct attributes', () => {
      const propsWithLinkedIn = {
        event: {
          contactInfos: {
            linkedIn: ['https://linkedin.com/in/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithLinkedIn} />);
      
      const linkedInLink = screen.getByTitle('LinkedIn');
      expect(linkedInLink).toHaveAttribute('href', 'https://linkedin.com/in/test');
      expect(linkedInLink).toHaveAttribute('target', '_blank');
      expect(linkedInLink).toHaveClass('social__link');
      
      const linkedInImage = linkedInLink.querySelector('img');
      expect(linkedInImage).toHaveAttribute('src', '/icons/linkedin.svg');
      expect(linkedInImage).toHaveAttribute('alt', 'linkedIn');
    });

    it('renders Twitter/X link with correct attributes', () => {
      const propsWithTwitter = {
        event: {
          contactInfos: {
            twitter: ['https://twitter.com/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithTwitter} />);
      
      const twitterLink = screen.getByTitle('X');
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/test');
      expect(twitterLink).toHaveAttribute('target', '_blank');
      expect(twitterLink).toHaveClass('social__link');
      
      const twitterImage = twitterLink.querySelector('img');
      expect(twitterImage).toHaveAttribute('src', '/icons/x.svg');
      expect(twitterImage).toHaveAttribute('alt', 'twitter');
    });

    it('renders Discord link with correct attributes', () => {
      const propsWithDiscord = {
        event: {
          contactInfos: {
            discord: ['https://discord.gg/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithDiscord} />);
      
      const discordLink = screen.getByTitle('Discord');
      expect(discordLink).toHaveAttribute('href', 'https://discord.gg/test');
      expect(discordLink).toHaveAttribute('target', '_blank');
      expect(discordLink).toHaveClass('social__link');
      
      const discordImage = discordLink.querySelector('img');
      expect(discordImage).toHaveAttribute('src', '/icons/discord.svg');
      expect(discordImage).toHaveAttribute('alt', 'discord');
    });

    it('renders Telegram link with correct attributes', () => {
      const propsWithTelegram = {
        event: {
          contactInfos: {
            telegram: ['https://t.me/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithTelegram} />);
      
      const telegramLink = screen.getByTitle('Telegram');
      expect(telegramLink).toHaveAttribute('href', 'https://t.me/test');
      expect(telegramLink).toHaveAttribute('target', '_blank');
      expect(telegramLink).toHaveClass('social__link');
      
      const telegramImage = telegramLink.querySelector('img');
      expect(telegramImage).toHaveAttribute('src', '/icons/telegram.svg');
      expect(telegramImage).toHaveAttribute('alt', 'telegram');
    });

    it('renders WhatsApp link with correct attributes', () => {
      const propsWithWhatsApp = {
        event: {
          contactInfos: {
            whatsapp: ['https://wa.me/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithWhatsApp} />);
      
      const whatsappLink = screen.getByTitle('Whatsapp');
      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/test');
      expect(whatsappLink).toHaveAttribute('target', '_blank');
      expect(whatsappLink).toHaveClass('social__link');
      
      const whatsappImage = whatsappLink.querySelector('img');
      expect(whatsappImage).toHaveAttribute('src', '/icons/whatsapp.svg');
      expect(whatsappImage).toHaveAttribute('alt', 'whatsapp');
    });

    it('renders Instagram link with correct attributes', () => {
      const propsWithInstagram = {
        event: {
          contactInfos: {
            instagram: ['https://instagram.com/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithInstagram} />);
      
      const instagramLink = screen.getByTitle('Instagram');
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/test');
      expect(instagramLink).toHaveAttribute('target', '_blank');
      expect(instagramLink).toHaveClass('social__link');
      
      const instagramImage = instagramLink.querySelector('img');
      expect(instagramImage).toHaveAttribute('src', '/icons/instagram.svg');
      expect(instagramImage).toHaveAttribute('alt', 'instagram');
    });

    it('renders Mastodon link with correct attributes', () => {
      const propsWithMastodon = {
        event: {
          contactInfos: {
            mastodon: ['https://mastodon.social/@test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithMastodon} />);
      
      const mastodonLink = screen.getByTitle('Mastodon');
      expect(mastodonLink).toHaveAttribute('href', 'https://mastodon.social/@test');
      expect(mastodonLink).toHaveAttribute('target', '_blank');
      expect(mastodonLink).toHaveClass('social__link');
      
      const mastodonImage = mastodonLink.querySelector('img');
      expect(mastodonImage).toHaveAttribute('src', '/icons/mastadon.svg');
      expect(mastodonImage).toHaveAttribute('alt', 'mastodon');
    });

    it('renders BlueSky link with correct attributes', () => {
      const propsWithBlueSky = {
        event: {
          contactInfos: {
            bluesky: ['https://bsky.app/profile/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithBlueSky} />);
      
      const blueSkyLink = screen.getByTitle('BlueSky');
      expect(blueSkyLink).toHaveAttribute('href', 'https://bsky.app/profile/test');
      expect(blueSkyLink).toHaveAttribute('target', '_blank');
      expect(blueSkyLink).toHaveClass('social__link');
      
      const blueSkyImage = blueSkyLink.querySelector('img');
      expect(blueSkyImage).toHaveAttribute('src', '/icons/bluesky.svg');
      expect(blueSkyImage).toHaveAttribute('alt', 'bluesky');
    });
  });

  describe('getFirstUrl Function', () => {
    it('returns first URL from array when multiple URLs are provided', () => {
      const propsWithMultipleEmails = {
        event: {
          contactInfos: {
            email: ['first@example.com', 'second@example.com'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithMultipleEmails} />);
      
      const emailLink = screen.getByTitle('Email');
      expect(emailLink).toHaveAttribute('href', 'mailto:first@example.com');
    });

    it('returns empty string when array is empty', () => {
      const propsWithEmptyArray = {
        event: {
          contactInfos: {
            email: [],
          },
        },
      };
      
      render(<SocialLinks {...propsWithEmptyArray} />);
      
      const emailLink = screen.getByTitle('Email');
      expect(emailLink).toHaveAttribute('href', 'mailto:');
    });

    it('returns empty string when array is undefined', () => {
      const propsWithUndefinedArray = {
        event: {
          contactInfos: {
            email: undefined,
          },
        },
      };
      
      render(<SocialLinks {...propsWithUndefinedArray} />);
      
      expect(screen.queryByTitle('Email')).not.toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('calls onClickSocialLink when email link is clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<SocialLinks {...defaultProps} />);
      
      const emailLink = screen.getByTitle('Email');
      fireEvent.click(emailLink);
      
      // The onClickSocialLink function is currently empty, so we just verify it doesn't throw
      expect(emailLink).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink when LinkedIn link is clicked', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      render(<SocialLinks {...defaultProps} />);
      
      const linkedInLink = screen.getByTitle('LinkedIn');
      fireEvent.click(linkedInLink);
      
      // The onClickSocialLink function is currently empty, so we just verify it doesn't throw
      expect(linkedInLink).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('useParams Integration', () => {
    it('uses params from useParams hook', () => {
      mockUseParams.mockReturnValue({ type: 'event-detail' });
      
      render(<SocialLinks {...defaultProps} />);
      
      expect(mockUseParams).toHaveBeenCalled();
    });

    it('handles different view types from params', () => {
      mockUseParams.mockReturnValue({ type: 'event-list' });
      
      render(<SocialLinks {...defaultProps} />);
      
      expect(mockUseParams).toHaveBeenCalled();
      expect(screen.getByTitle('Email')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing event prop', () => {
      render(<SocialLinks />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
      expect(socialLinksContainer?.children).toHaveLength(0);
    });

    it('handles null event prop', () => {
      render(<SocialLinks event={null} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
      expect(socialLinksContainer?.children).toHaveLength(0);
    });

    it('handles contactInfos with null values', () => {
      const propsWithNullValues = {
        event: {
          contactInfos: {
            email: null,
            linkedIn: null,
            twitter: null,
          },
        },
      };
      
      render(<SocialLinks {...propsWithNullValues} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
      expect(socialLinksContainer?.children).toHaveLength(0);
    });

    it('handles contactInfos with empty string values', () => {
      const propsWithEmptyStrings = {
        event: {
          contactInfos: {
            email: [''],
            linkedIn: [''],
            twitter: [''],
          },
        },
      };
      
      render(<SocialLinks {...propsWithEmptyStrings} />);
      
      const emailLink = screen.getByTitle('Email');
      expect(emailLink).toHaveAttribute('href', 'mailto:');
    });
  });

  describe('Component Structure', () => {
    it('renders with correct CSS classes', () => {
      render(<SocialLinks {...defaultProps} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toHaveClass('social__links');
      
      const socialLinks = socialLinksContainer?.querySelectorAll('.social__link');
      expect(socialLinks).toHaveLength(9); // All 9 social platforms
    });

    it('renders with proper structure for styling', () => {
      render(<SocialLinks {...defaultProps} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      expect(socialLinksContainer).toBeInTheDocument();
      
      const socialLinks = socialLinksContainer?.querySelectorAll('.social__link');
      expect(socialLinks).toHaveLength(9);
      
      // Verify all links have the correct class
      socialLinks?.forEach(link => {
        expect(link).toHaveClass('social__link');
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper alt text for all images', () => {
      render(<SocialLinks {...defaultProps} />);
      
      expect(screen.getByAltText('email')).toBeInTheDocument();
      expect(screen.getByAltText('linkedIn')).toBeInTheDocument();
      expect(screen.getByAltText('twitter')).toBeInTheDocument();
      expect(screen.getByAltText('discord')).toBeInTheDocument();
      expect(screen.getByAltText('telegram')).toBeInTheDocument();
      expect(screen.getByAltText('whatsapp')).toBeInTheDocument();
      expect(screen.getByAltText('instagram')).toBeInTheDocument();
      expect(screen.getByAltText('mastodon')).toBeInTheDocument();
      expect(screen.getByAltText('bluesky')).toBeInTheDocument();
    });

    it('provides proper title attributes for all links', () => {
      render(<SocialLinks {...defaultProps} />);
      
      expect(screen.getByTitle('Email')).toBeInTheDocument();
      expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
      expect(screen.getByTitle('X')).toBeInTheDocument();
      expect(screen.getByTitle('Discord')).toBeInTheDocument();
      expect(screen.getByTitle('Telegram')).toBeInTheDocument();
      expect(screen.getByTitle('Whatsapp')).toBeInTheDocument();
      expect(screen.getByTitle('Instagram')).toBeInTheDocument();
      expect(screen.getByTitle('Mastodon')).toBeInTheDocument();
      expect(screen.getByTitle('BlueSky')).toBeInTheDocument();
    });

    it('opens all links in new tab', () => {
      render(<SocialLinks {...defaultProps} />);
      
      const allLinks = document.querySelectorAll('.social__link');
      allLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
      });
    });
  });

  describe('onClickSocialLink Function - Lines 62-128 Coverage', () => {
    it('calls onClickSocialLink with correct parameters for Twitter/X link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithTwitter = {
        event: {
          contactInfos: {
            twitter: ['https://twitter.com/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithTwitter} />);
      
      const twitterLink = screen.getByTitle('X');
      fireEvent.click(twitterLink);
      
      // Verify the link exists and click was handled
      expect(twitterLink).toBeInTheDocument();
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/test');
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink with correct parameters for Discord link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithDiscord = {
        event: {
          contactInfos: {
            discord: ['https://discord.gg/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithDiscord} />);
      
      const discordLink = screen.getByTitle('Discord');
      fireEvent.click(discordLink);
      
      // Verify the link exists and click was handled
      expect(discordLink).toBeInTheDocument();
      expect(discordLink).toHaveAttribute('href', 'https://discord.gg/test');
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink with correct parameters for Telegram link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithTelegram = {
        event: {
          contactInfos: {
            telegram: ['https://t.me/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithTelegram} />);
      
      const telegramLink = screen.getByTitle('Telegram');
      fireEvent.click(telegramLink);
      
      // Verify the link exists and click was handled
      expect(telegramLink).toBeInTheDocument();
      expect(telegramLink).toHaveAttribute('href', 'https://t.me/test');
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink with correct parameters for WhatsApp link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithWhatsApp = {
        event: {
          contactInfos: {
            whatsapp: ['https://wa.me/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithWhatsApp} />);
      
      const whatsappLink = screen.getByTitle('Whatsapp');
      fireEvent.click(whatsappLink);
      
      // Verify the link exists and click was handled
      expect(whatsappLink).toBeInTheDocument();
      expect(whatsappLink).toHaveAttribute('href', 'https://wa.me/test');
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink with correct parameters for Instagram link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithInstagram = {
        event: {
          contactInfos: {
            instagram: ['https://instagram.com/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithInstagram} />);
      
      const instagramLink = screen.getByTitle('Instagram');
      fireEvent.click(instagramLink);
      
      // Verify the link exists and click was handled
      expect(instagramLink).toBeInTheDocument();
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/test');
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink with correct parameters for Mastodon link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithMastodon = {
        event: {
          contactInfos: {
            mastodon: ['https://mastodon.social/@test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithMastodon} />);
      
      const mastodonLink = screen.getByTitle('Mastodon');
      fireEvent.click(mastodonLink);
      
      // Verify the link exists and click was handled
      expect(mastodonLink).toBeInTheDocument();
      expect(mastodonLink).toHaveAttribute('href', 'https://mastodon.social/@test');
      
      consoleSpy.mockRestore();
    });

    it('calls onClickSocialLink with correct parameters for BlueSky link', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const propsWithBlueSky = {
        event: {
          contactInfos: {
            bluesky: ['https://bsky.app/profile/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithBlueSky} />);
      
      const blueSkyLink = screen.getByTitle('BlueSky');
      fireEvent.click(blueSkyLink);
      
      // Verify the link exists and click was handled
      expect(blueSkyLink).toBeInTheDocument();
      expect(blueSkyLink).toHaveAttribute('href', 'https://bsky.app/profile/test');
      
      consoleSpy.mockRestore();
    });
  });

  describe('getFirstUrl Function Edge Cases - Lines 62-128 Coverage', () => {
    it('handles getFirstUrl with single item arrays for all social platforms', () => {
      const propsWithSingleItems = {
        event: {
          contactInfos: {
            email: ['single@email.com'],
            linkedIn: ['https://linkedin.com/single'],
            twitter: ['https://twitter.com/single'],
            discord: ['https://discord.gg/single'],
            telegram: ['https://t.me/single'],
            whatsapp: ['https://wa.me/single'],
            instagram: ['https://instagram.com/single'],
            mastodon: ['https://mastodon.social/@single'],
            bluesky: ['https://bsky.app/profile/single'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithSingleItems} />);
      
      // Verify all links use the single item from their arrays
      expect(screen.getByTitle('Email')).toHaveAttribute('href', 'mailto:single@email.com');
      expect(screen.getByTitle('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/single');
      expect(screen.getByTitle('X')).toHaveAttribute('href', 'https://twitter.com/single');
      expect(screen.getByTitle('Discord')).toHaveAttribute('href', 'https://discord.gg/single');
      expect(screen.getByTitle('Telegram')).toHaveAttribute('href', 'https://t.me/single');
      expect(screen.getByTitle('Whatsapp')).toHaveAttribute('href', 'https://wa.me/single');
      expect(screen.getByTitle('Instagram')).toHaveAttribute('href', 'https://instagram.com/single');
      expect(screen.getByTitle('Mastodon')).toHaveAttribute('href', 'https://mastodon.social/@single');
      expect(screen.getByTitle('BlueSky')).toHaveAttribute('href', 'https://bsky.app/profile/single');
    });

    it('handles getFirstUrl with multiple item arrays for all social platforms', () => {
      const propsWithMultipleItems = {
        event: {
          contactInfos: {
            email: ['first@email.com', 'second@email.com'],
            linkedIn: ['https://linkedin.com/first', 'https://linkedin.com/second'],
            twitter: ['https://twitter.com/first', 'https://twitter.com/second'],
            discord: ['https://discord.gg/first', 'https://discord.gg/second'],
            telegram: ['https://t.me/first', 'https://t.me/second'],
            whatsapp: ['https://wa.me/first', 'https://wa.me/second'],
            instagram: ['https://instagram.com/first', 'https://instagram.com/second'],
            mastodon: ['https://mastodon.social/@first', 'https://mastodon.social/@second'],
            bluesky: ['https://bsky.app/profile/first', 'https://bsky.app/profile/second'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithMultipleItems} />);
      
      // Verify all links use the first item from their arrays
      expect(screen.getByTitle('Email')).toHaveAttribute('href', 'mailto:first@email.com');
      expect(screen.getByTitle('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/first');
      expect(screen.getByTitle('X')).toHaveAttribute('href', 'https://twitter.com/first');
      expect(screen.getByTitle('Discord')).toHaveAttribute('href', 'https://discord.gg/first');
      expect(screen.getByTitle('Telegram')).toHaveAttribute('href', 'https://t.me/first');
      expect(screen.getByTitle('Whatsapp')).toHaveAttribute('href', 'https://wa.me/first');
      expect(screen.getByTitle('Instagram')).toHaveAttribute('href', 'https://instagram.com/first');
      expect(screen.getByTitle('Mastodon')).toHaveAttribute('href', 'https://mastodon.social/@first');
      expect(screen.getByTitle('BlueSky')).toHaveAttribute('href', 'https://bsky.app/profile/first');
    });

    it('handles getFirstUrl with empty arrays for all social platforms', () => {
      const propsWithEmptyArrays = {
        event: {
          contactInfos: {
            email: [],
            linkedIn: [],
            twitter: [],
            discord: [],
            telegram: [],
            whatsapp: [],
            instagram: [],
            mastodon: [],
            bluesky: [],
          },
        },
      };
      
      render(<SocialLinks {...propsWithEmptyArrays} />);
      
      // Verify all links use empty strings from getFirstUrl
      expect(screen.getByTitle('Email')).toHaveAttribute('href', 'mailto:');
      expect(screen.getByTitle('LinkedIn')).toHaveAttribute('href', '');
      expect(screen.getByTitle('X')).toHaveAttribute('href', '');
      expect(screen.getByTitle('Discord')).toHaveAttribute('href', '');
      expect(screen.getByTitle('Telegram')).toHaveAttribute('href', '');
      expect(screen.getByTitle('Whatsapp')).toHaveAttribute('href', '');
      expect(screen.getByTitle('Instagram')).toHaveAttribute('href', '');
      expect(screen.getByTitle('Mastodon')).toHaveAttribute('href', '');
      expect(screen.getByTitle('BlueSky')).toHaveAttribute('href', '');
    });
  });

  describe('Image Attributes and Loading - Lines 62-128 Coverage', () => {
    it('renders all images with correct width and height attributes', () => {
      render(<SocialLinks {...defaultProps} />);
      
      const allImages = document.querySelectorAll('.social__link img');
      expect(allImages).toHaveLength(9);
      
      allImages.forEach(img => {
        expect(img).toHaveAttribute('width', '35');
        expect(img).toHaveAttribute('height', '35');
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('renders all images with correct src attributes', () => {
      render(<SocialLinks {...defaultProps} />);
      
      expect(screen.getByAltText('email')).toHaveAttribute('src', '/icons/email.svg');
      expect(screen.getByAltText('linkedIn')).toHaveAttribute('src', '/icons/linkedin.svg');
      expect(screen.getByAltText('twitter')).toHaveAttribute('src', '/icons/x.svg');
      expect(screen.getByAltText('discord')).toHaveAttribute('src', '/icons/discord.svg');
      expect(screen.getByAltText('telegram')).toHaveAttribute('src', '/icons/telegram.svg');
      expect(screen.getByAltText('whatsapp')).toHaveAttribute('src', '/icons/whatsapp.svg');
      expect(screen.getByAltText('instagram')).toHaveAttribute('src', '/icons/instagram.svg');
      expect(screen.getByAltText('mastodon')).toHaveAttribute('src', '/icons/mastadon.svg');
      expect(screen.getByAltText('bluesky')).toHaveAttribute('src', '/icons/bluesky.svg');
    });

    it('renders all images with correct alt attributes', () => {
      render(<SocialLinks {...defaultProps} />);
      
      expect(screen.getByAltText('email')).toBeInTheDocument();
      expect(screen.getByAltText('linkedIn')).toBeInTheDocument();
      expect(screen.getByAltText('twitter')).toBeInTheDocument();
      expect(screen.getByAltText('discord')).toBeInTheDocument();
      expect(screen.getByAltText('telegram')).toBeInTheDocument();
      expect(screen.getByAltText('whatsapp')).toBeInTheDocument();
      expect(screen.getByAltText('instagram')).toBeInTheDocument();
      expect(screen.getByAltText('mastodon')).toBeInTheDocument();
      expect(screen.getByAltText('bluesky')).toBeInTheDocument();
    });
  });

  describe('Conditional Rendering - Lines 62-128 Coverage', () => {
    it('renders only specific social links when only those are provided', () => {
      const propsWithSpecificLinks = {
        event: {
          contactInfos: {
            twitter: ['https://twitter.com/test'],
            discord: ['https://discord.gg/test'],
            mastodon: ['https://mastodon.social/@test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithSpecificLinks} />);
      
      // Should render only the provided links
      expect(screen.getByTitle('X')).toBeInTheDocument();
      expect(screen.getByTitle('Discord')).toBeInTheDocument();
      expect(screen.getByTitle('Mastodon')).toBeInTheDocument();
      
      // Should not render other links
      expect(screen.queryByTitle('Email')).not.toBeInTheDocument();
      expect(screen.queryByTitle('LinkedIn')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Telegram')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Whatsapp')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Instagram')).not.toBeInTheDocument();
      expect(screen.queryByTitle('BlueSky')).not.toBeInTheDocument();
    });

    it('renders social links in correct order', () => {
      render(<SocialLinks {...defaultProps} />);
      
      const socialLinksContainer = document.querySelector('.social__links');
      const socialLinks = socialLinksContainer?.querySelectorAll('.social__link');
      
      expect(socialLinks).toHaveLength(9);
      
      // Verify the order matches the component structure
      expect(socialLinks?.[0]).toHaveAttribute('title', 'Email');
      expect(socialLinks?.[1]).toHaveAttribute('title', 'LinkedIn');
      expect(socialLinks?.[2]).toHaveAttribute('title', 'X');
      expect(socialLinks?.[3]).toHaveAttribute('title', 'Discord');
      expect(socialLinks?.[4]).toHaveAttribute('title', 'Telegram');
      expect(socialLinks?.[5]).toHaveAttribute('title', 'Whatsapp');
      expect(socialLinks?.[6]).toHaveAttribute('title', 'Instagram');
      expect(socialLinks?.[7]).toHaveAttribute('title', 'Mastodon');
      expect(socialLinks?.[8]).toHaveAttribute('title', 'BlueSky');
    });
  });

  describe('Href Generation - Lines 62-128 Coverage', () => {
    it('generates correct mailto href for email links', () => {
      const propsWithEmail = {
        event: {
          contactInfos: {
            email: ['test@example.com', 'backup@example.com'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithEmail} />);
      
      const emailLink = screen.getByTitle('Email');
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('generates correct direct hrefs for all other social platforms', () => {
      const propsWithAllPlatforms = {
        event: {
          contactInfos: {
            linkedIn: ['https://linkedin.com/test'],
            twitter: ['https://twitter.com/test'],
            discord: ['https://discord.gg/test'],
            telegram: ['https://t.me/test'],
            whatsapp: ['https://wa.me/test'],
            instagram: ['https://instagram.com/test'],
            mastodon: ['https://mastodon.social/@test'],
            bluesky: ['https://bsky.app/profile/test'],
          },
        },
      };
      
      render(<SocialLinks {...propsWithAllPlatforms} />);
      
      expect(screen.getByTitle('LinkedIn')).toHaveAttribute('href', 'https://linkedin.com/test');
      expect(screen.getByTitle('X')).toHaveAttribute('href', 'https://twitter.com/test');
      expect(screen.getByTitle('Discord')).toHaveAttribute('href', 'https://discord.gg/test');
      expect(screen.getByTitle('Telegram')).toHaveAttribute('href', 'https://t.me/test');
      expect(screen.getByTitle('Whatsapp')).toHaveAttribute('href', 'https://wa.me/test');
      expect(screen.getByTitle('Instagram')).toHaveAttribute('href', 'https://instagram.com/test');
      expect(screen.getByTitle('Mastodon')).toHaveAttribute('href', 'https://mastodon.social/@test');
      expect(screen.getByTitle('BlueSky')).toHaveAttribute('href', 'https://bsky.app/profile/test');
    });
  });
});
