import { TestBed, inject } from '@angular/core/testing';

import { RepairCollectGetDataFromServerService } from './repair-collect-get-data-from-server.service';

describe('RepairCollectGetDataFromServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairCollectGetDataFromServerService]
    });
  });

  it('should be created', inject([RepairCollectGetDataFromServerService], (service: RepairCollectGetDataFromServerService) => {
    expect(service).toBeTruthy();
  }));
});
