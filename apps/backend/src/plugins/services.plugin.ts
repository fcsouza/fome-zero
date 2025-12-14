import { Elysia } from 'elysia';
import { TodoRepository } from '../repositories/todo.repository';
import { UserRepository } from '../repositories/user.repository';
import { DonationRepository } from '../repositories/donation.repository';
import { CertificateRepository } from '../repositories/certificate.repository';
import { ChecklistRepository } from '../repositories/checklist.repository';
import { MatchRepository } from '../repositories/match.repository';
import { TodoService } from '../services/todo.service';
import { UserService } from '../services/user.service';
import { DonationService } from '../services/donation.service';
import { ChecklistService } from '../services/checklist.service';
import { MatchService } from '../services/match.service';
import { aiService } from '../services/ai.service';
import { certificateService } from '../services/certificate.service';
import { chatService } from '../services/chat.service';

const todoRepo = new TodoRepository();
const userRepo = new UserRepository();
const donationRepo = new DonationRepository();
const certificateRepo = new CertificateRepository();
const checklistRepo = new ChecklistRepository();
const matchRepo = new MatchRepository();

const todoService = new TodoService(todoRepo);
const userService = new UserService(userRepo);
const donationService = new DonationService(donationRepo, certificateRepo);
const checklistService = new ChecklistService(checklistRepo);
const matchService = new MatchService(matchRepo, donationRepo);

/**
 * Services plugin - provides all services as decorators
 * Use this plugin to make services available in route handlers with type safety
 */
export const servicesPlugin = new Elysia({ name: 'services' })
  .decorate('todoService', todoService)
  .decorate('userService', userService)
  .decorate('donationService', donationService)
  .decorate('checklistService', checklistService)
  .decorate('matchService', matchService)
  .decorate('aiService', aiService)
  .decorate('certificateService', certificateService)
  .decorate('chatService', chatService);
