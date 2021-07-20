import { TestBed } from '@angular/core/testing';

import { PlotQueryService } from './plot-query.service';

describe('PlotQueryService', () => {
  let service: PlotQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlotQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
