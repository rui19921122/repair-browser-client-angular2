import { TestBed, inject } from '@angular/core/testing';

import { RepairHistoryDetailApiService } from './repair-history-detail-api.service';

describe('RepairHistoryDetailApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RepairHistoryDetailApiService]
    });
  });

  it('should be created', inject([RepairHistoryDetailApiService], (service: RepairHistoryDetailApiService) => {
    expect(service).toBeTruthy();
  }));
});
