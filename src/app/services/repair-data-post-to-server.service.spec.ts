import { TestBed, inject } from '@angular/core/testing';

import { RepairDataPostToServerService } from './repair-data-post-to-server.service';

describe('RepairDataPostToServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairDataPostToServerService]
    });
  });

  it('should be created', inject([RepairDataPostToServerService], (service: RepairDataPostToServerService) => {
    expect(service).toBeTruthy();
  }));
});
